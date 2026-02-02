import { crc32 } from "crc";
import { createHash } from "crypto";
import { HashAlgorithm, ISCodeFormatter } from "./scodeFormatter.interface";

export abstract class SCodeBase<TSchema, TEncodedAccess = string>
  implements ISCodeFormatter<TEncodedAccess>
{
  protected schema: TSchema;
  protected schemaHash: string;
  protected hashAlgorithm: HashAlgorithm;

  constructor(schema: TSchema, hashAlgorithm: HashAlgorithm = "crc32") {
    this.schema = schema;
    this.hashAlgorithm = hashAlgorithm;
    this.schemaHash = this.computeHash();
  }

  protected computeHash(): string {
    const json = JSON.stringify(this.schema);
    if (this.hashAlgorithm === "sha256") {
      return createHash("sha256").update(json).digest("hex");
    }
    return (crc32(json) >>> 0).toString(16);
  }

  public getSchema(): any {
    return this.schema;
  }

  public getSchemaHash(): string {
    return this.schemaHash;
  }

  public validateHash(providedHash: string): void {
    if (providedHash !== this.schemaHash) {
      throw new Error(
        "Schema hash mismatch. Access data is outdated or invalid."
      );
    }
  }

  abstract encodeAccess(data: any): {
    access: TEncodedAccess;
    schemaHash: string;
  };
  abstract parseAccess(access: TEncodedAccess, hash: string): string[];
  abstract hasAccess(key: string, access: TEncodedAccess): boolean;
}
