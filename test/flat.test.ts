import { createFlatSCode } from "../src/flat/scode.flat";
import type { SCodeSchema } from "../src/scode.types";

const schema: SCodeSchema = {
  user: { profile: ["read", "update"], settings: ["change"] },
  order: { delivery: ["start", "cancel"] },
};

describe("FlatSCodeFormatter", () => {
  const formatter = createFlatSCode(schema);

  const accessObject = {
    "user.profile.read": true,
    "user.profile.update": false,
    "user.settings.change": true,
    "order.delivery.start": false,
    "order.delivery.cancel": true,
  };

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

  it("should return true for hasAccess when allowed", () => {
    const { access } = formatter.encodeAccess(accessObject);
    expect(formatter.hasAccess("user.profile.read", access)).toBe(true);
    expect(formatter.hasAccess("user.profile.update", access)).toBe(false);
  });
});
