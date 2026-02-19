# DECISIONS

*Every significant decision with reasoning. Never delete, only append.*

---

## D001 — isolated-vm as execution engine (SUPERSEDED by D004)
**Date:** 2026-02-19
**Decision:** Use `isolated-vm` for sandboxed code execution
**Reason:** V8 isolates are battle-tested, stay within Node.js ecosystem, near-zero cold start, memory/timeout limits built-in, simple API.
**Rejected alternatives:**
- Deno subprocess — external runtime dependency, slower cold start
- QuickJS — no formal security guarantees
- MicroVMs — overkill for MVP
- Node.js `vm` module — not secure
- Worker threads — share memory with host

---

## D002 — Divhunt framework integration
**Date:** 2026-02-19
**Decision:** Use divhunt framework as project foundation
**Reason:** Consistent with agents project, addon system provides structure, command system for API exposure later.

---

## D003 — Console.log bridge in MVP
**Date:** 2026-02-19
**Decision:** Include console.log bridge from the start
**Reason:** Essential for debugging user code. Without it, users have no way to debug their callbacks.

---

## D004 — Switch from isolated-vm to @sebastianwessel/quickjs
**Date:** 2026-02-19
**Decision:** Replace `isolated-vm` with `@sebastianwessel/quickjs` (QuickJS compiled to WebAssembly)
**Reason:** `isolated-vm` fails to compile on Node.js v25.2.1 due to C++20 requirements and missing prebuilt binaries. Project is in maintenance mode. `@sebastianwessel/quickjs` is pure Wasm (no native compilation), works on any Node.js >=18, has built-in fetch client, first-class memory/timeout limits, and true Wasm-level isolation. Actively maintained (v3.0.1).
**Rejected alternatives:**
- `isolated-vm` — won't compile on Node 25, maintenance mode
- Deno subprocess — external runtime dependency
- Cloudflare `workerd` — separate daemon, not embeddable
- `vm2` — fundamentally broken, CVE-2026-22709
- Node.js `--experimental-permission` — process-level only, multiple bypass CVEs
- MicroVMs — overkill for MVP
