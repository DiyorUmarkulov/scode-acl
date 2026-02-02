import { SCodeBase } from "../core/scode.base";
import { AccessString, SCodeSchema } from "../scode.types";
import { HashAlgorithm } from "../core/scodeFormatter.interface";

function flattenSchema(
  schema: SCodeSchema,
  prefix: string[] = [],
  acc: string[] = []
): string[] {
  for (const key in schema) {
    const value = schema[key];
    if (Array.isArray(value)) {
      value.forEach((action) => acc.push([...prefix, key, action].join(".")));
    } else {
      flattenSchema(value, [...prefix, key], acc);
    }
  }
  return acc;
}

function extractDotPaths(
  obj: Record<string, any>,
  trail: string[] = []
): string[] {
  const paths: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      paths.push(...extractDotPaths(value, [...trail, key]));
    } else if (value === true) {
      paths.push([...trail, key].join("."));
    }
  }
  return paths;
}

export class FlatSCodeFormatter extends SCodeBase<string[], AccessString> {
  constructor(schema: SCodeSchema, hashAlgorithm?: HashAlgorithm) {
    const flatSchema = flattenSchema(schema);
    super(flatSchema, hashAlgorithm);
  }

  public encodeAccess(fullAccess: Record<string, any>): {
    access: AccessString;
    schemaHash: string;
  } {
    const activePaths = extractDotPaths(fullAccess);
    const indexes = activePaths
      .map((dotPath) => this.schema.indexOf(dotPath))
      .filter((index) => index !== -1);

    return {
      access: indexes.join(" "),
      schemaHash: this.schemaHash,
    };
  }

  public parseAccess(access: AccessString, hash: string): string[] {
    this.validateHash(hash);

    return access
      .split(" ")
      .map((indexStr) => this.schema[parseInt(indexStr, 10)])
      .filter(Boolean);
  }

  public hasAccess(key: string, access: AccessString): boolean {
    const index = this.schema.indexOf(key);
    if (index === -1) return false;
    return access.split(" ").includes(index.toString());
  }
}

export function createFlatSCode(
  schema: SCodeSchema,
  hashAlgorithm?: HashAlgorithm
): FlatSCodeFormatter {
  return new FlatSCodeFormatter(schema, hashAlgorithm);
}
