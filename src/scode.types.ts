export type FlatSchema = string[];
export type NestedSchema = Record<string, any>;
export interface SCodeSchema {
  [key: string]: string[] | SCodeSchema;
}
export type AccessString = string;
export type NestedAccessString = string;
