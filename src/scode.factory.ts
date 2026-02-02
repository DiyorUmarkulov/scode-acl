import { createFlatSCode, FlatSCodeFormatter } from "./flat/scode.flat";
import { createNestedSCode, NestedSCodeFormatter } from "./nested/scode.nested";
import { SCodeSchema } from "./scode.types";
import { HashAlgorithm } from "./core/scodeFormatter.interface";

export type SCodeOptions =
  | { mode: "flat"; schema: SCodeSchema; hashAlgorithm?: HashAlgorithm }
  | { mode: "nested"; schema: SCodeSchema; hashAlgorithm?: HashAlgorithm };

export type SCodeInstance = FlatSCodeFormatter | NestedSCodeFormatter;

export function createSCode(options: SCodeOptions): SCodeInstance {
  if (options.mode === "flat") {
    return createFlatSCode(options.schema, options.hashAlgorithm);
  }
  return createNestedSCode(options.schema, options.hashAlgorithm);
}
