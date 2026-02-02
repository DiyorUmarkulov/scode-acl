import { createNestedSCode } from "../src/nested/scode.nested";
import type { SCodeSchema } from "../src/scode.types";

const schema: SCodeSchema = {
  user: { profile: ["read", "update"], settings: ["change"] },
  order: { delivery: ["start", "cancel"] },
};

const accessObject = {
  user: {
    profile: { read: true, update: false },
    settings: { change: true },
  },
  order: {
    delivery: { start: false, cancel: true },
  },
};

describe("NestedSCodeFormatter", () => {
  const formatter = createNestedSCode(schema);

  it("should encode and parse correctly", () => {
    const { access, schemaHash } = formatter.encodeAccess(accessObject);
    expect(schemaHash).toBe(formatter.getSchemaHash());

    const parsed = formatter.parseAccess(access);
    expect(parsed).toEqual([
      "user.profile.read",
      "user.settings.change",
      "order.delivery.cancel",
    ]);
  });

  it("should return correct hasAccess", () => {
    const { access } = formatter.encodeAccess(accessObject);
    expect(formatter.hasAccess("user.profile.read", access)).toBe(true);
    expect(formatter.hasAccess("user.profile.update", access)).toBe(false);
  });
});
