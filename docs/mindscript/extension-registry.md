# MindScript Extension Registry Policy

## Purpose

Define safe extension rules without fragmenting public interoperability.

## Rules

1. Public core contracts remain vendor-neutral.
2. Private/product extensions must use a namespaced prefix (for example `orion.*`, `telescope.*`).
3. Unknown extensions must be ignored safely by public consumers unless declared required.
4. Promote private extensions to public only through RFC.

## Collision Avoidance

1. Prefix by owner namespace.
2. Keep extension IDs stable and documented.
3. Avoid reusing public field names for private semantics.
