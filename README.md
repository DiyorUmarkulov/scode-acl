### SCode ACL

## Overview:

SCode ACL (Structured Compressed Access Control List) is a minimalistic, schema-driven access control system that encodes access data into compact, hash-verifiable strings. It supports both flat and deeply nested permissions and is ideal for dynamic ACL use in modern applications.

---

## Features:

- Ultra-compact access strings like "0.1.2 1.0.3"
- Supports Flat and Nested encoding modes
- Hash versioning via CRC32 or SHA256
- Full encoding/decoding and permission checks
- Human-readable dot-paths for permissions
- Only stores true/allowed permissions
- Schema-driven and easy to sync across frontend/backend

---

## Schema Example:

```ts
const schema = {
  user: {
    profile: ["read", "update"],
    settings: ["change"],
  },
  order: {
    delivery: ["start", "cancel"],
  },
};
```

---

## Access Object Example:

```ts
const access = {
  user: {
    profile: { read: true },
    settings: { change: true },
  },
  order: {
    delivery: { cancel: true },
  },
};
```

---

## Usage Example:

```ts
import { createSCode } from "scode-acl";

const formatter = createSCode({ mode: "nested", schema });

const { access: encodedAccess, schemaHash } = formatter.encodeAccess(access);

formatter.parseAccess(encodedAccess);
// → ['user.profile.read', 'user.settings.change', 'order.delivery.cancel']

formatter.hasAccess("user.profile.read", encodedAccess);
// → true

formatter.validateHash(schemaHash);
// Throws error if schema has changed
```

---

## Modes:

Flat Mode:

- Flattens permissions like "user.profile.read" into an array
- Encodes them by index: "0 3 7"

Nested Mode:

- Encodes based on schema path indices: "0.1.0 1.0.1"
- More suitable for tree structures

---

## Benefits:

- 10–50x smaller than JSON ACL
- Built-in schema validation using hash
- Usable in tokens, sessions, guards, and menus
- Type-safe and compatible with RBAC/DAC/ABAC
- Easy integration in frontend/backend

---

## API Summary:

`createSCode({ mode, schema, hashAlgorithm? })` → `SCodeFormatter`

`formatter.encodeAccess(accessObject)` → `{ access, schemaHash }`

`formatter.parseAccess(encodedString)` → `string[]`

`formatter.hasAccess("dot.path", encodedString)` → `boolean`

`formatter.validateHash(providedHash)` → `void`

---

## Hash Algorithm:

Supports:

- 'crc32' (default, short and fast)
- 'sha256' (longer, more secure)

---

## Benchmark (SCode ACL vs JSON ACL):

Encode:

- JSON: ~8ms
- SCode Flat: ~1.2ms
- SCode Nested: ~2.3ms

Size (for 30+ permissions):

- JSON: ~300 bytes
- SCode Flat: ~16 bytes
- SCode Nested: ~28 bytes

---

## License: MIT
