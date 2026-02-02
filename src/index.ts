export { createSCode, SCodeInstance, SCodeOptions } from "./scode.factory";

export type {
  SCodeSchema,
  FlatSchema,
  NestedSchema,
  AccessString,
  NestedAccessString,
} from "./scode.types";

export type {
  ISCodeFormatter,
  HashAlgorithm,
} from "./core/scodeFormatter.interface";

export { FlatSCodeFormatter, createFlatSCode } from "./flat/scode.flat";

export { NestedSCodeFormatter, createNestedSCode } from "./nested/scode.nested";

export { SCodeBase } from "./core/scode.base";
