import { SCodeBase } from "../core/scode.base";
import { NestedAccessString, SCodeSchema } from "../scode.types";
import { HashAlgorithm } from "../core/scodeFormatter.interface";

function flattenNestedSchema(
  schema: SCodeSchema,
  prefix: number[] = [],
  acc: Record<string, string> = {},
  path: string[] = []
): Record<string, string> {
  const keys = Object.keys(schema);
  keys.forEach((key, i) => {
    const value = schema[key];
    const currentPath = [...path, key];
    if (Array.isArray(value)) {
      value.forEach((action: string, j: number) => {
        const code = [...prefix, i, j].join(".");
        acc[code] = [...currentPath, action].join(".");
      });
    } else {
      flattenNestedSchema(value, [...prefix, i], acc, currentPath);
    }
  });
  return acc;
}

export class NestedSCodeFormatter extends SCodeBase<
  SCodeSchema,
  NestedAccessString
> {
  private flatMap: Record<string, string>;
  private reverseMap: Record<string, string>;

  constructor(schema: SCodeSchema, hashAlgorithm?: HashAlgorithm) {
    super(schema, hashAlgorithm);
    this.flatMap = flattenNestedSchema(schema);
    this.reverseMap = Object.fromEntries(
      Object.entries(this.flatMap).map(([k, v]) => [v, k])
    );
  }

  public encodeAccess(obj: Record<string, any>): {
    access: NestedAccessString;
    schemaHash: string;
  } {
    const paths: string[] = [];
    const walk = (current: any, trail: string[] = []) => {
      Object.entries(current).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          walk(value, [...trail, key]);
        } else if (value === true) {
          const flatKey = [...trail, key].join(".");
          const encoded = this.reverseMap[flatKey];
          if (encoded) paths.push(encoded);
        }
      });
    };
    walk(obj);
    return {
      access: paths.join(" "),
      schemaHash: this.schemaHash,
    };
  }

  public parseAccess(access: NestedAccessString, hash: string): string[] {
    this.validateHash(hash);

    return access
      .split(" ")
      .map((code) => this.flatMap[code])
      .filter(Boolean);
  }

  public hasAccess(dotPath: string, access: NestedAccessString): boolean {
    const code = this.reverseMap[dotPath];
    return code ? access.split(" ").includes(code) : false;
  }
}

export function createNestedSCode(
  schema: SCodeSchema,
  hashAlgorithm?: HashAlgorithm
): NestedSCodeFormatter {
  return new NestedSCodeFormatter(schema, hashAlgorithm);
}
