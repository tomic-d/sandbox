# Brief — Divhunt Sandbox

## Purpose

Secure JavaScript execution environment for user-defined agent callbacks. Users write JS code in the UI, that code runs in a QuickJS WebAssembly sandbox with controlled access to HTTP only.

---

## Problem

Agents platform allows users to create custom agents via UI. These agents need to execute user-written JavaScript code (callbacks) that interact with external APIs. This code is untrusted and must be isolated from the host system.

### Requirements

- Execute arbitrary user-written JavaScript securely
- Allow HTTP requests (fetch) to external APIs
- Receive input data, return output data
- Enforce memory and CPU time limits
- No access to filesystem, environment, other users, or host internals
- Console.log bridge for debugging

### Non-Requirements

- No npm/module support inside sandbox
- No filesystem access
- No database access
- No WebSocket or streaming
- Not published to npm — internal project only

---

## Decision

**`@sebastianwessel/quickjs`** — QuickJS engine compiled to WebAssembly, running inside Node.js.

### Why `@sebastianwessel/quickjs`

- Pure Wasm — no native compilation, works on any Node.js version (>=18)
- Wasm boundary provides true isolation — guest code cannot access host
- Built-in fetch client — no custom bridge pattern needed
- Memory limits, execution timeout, max stack size — first-class API
- Console override for log bridge
- Actively maintained (v3.0.1, 2025)
- Simple API — `npm install`, load variant, run code

### Rejected Alternatives

| Alternative | Why Rejected |
|---|---|
| `isolated-vm` | Maintenance mode, fails to compile on Node.js 25+ (C++20 issues), no prebuilt binaries for latest Node |
| Deno subprocess | External runtime dependency, slower cold start, more complex IPC |
| MicroVMs (Firecracker/e2b) | Overkill for MVP, significant infrastructure overhead |
| Node.js `vm` module | Not secure — trivial to escape sandbox |
| `vm2` | Fundamentally broken architecture, CVE-2026-22709 (CVSS 9.8) |
| Worker threads | Share memory with host, not truly isolated |
| Cloudflare `workerd` | Separate daemon process, not embeddable, incomplete isolation alone |
| Node.js `--experimental-permission` | Process-level only, not per-code isolation, multiple bypass CVEs |

---

## Architecture

### Flow

```
User writes JS code in UI
        │
        ▼
Host receives code + input data
        │
        ▼
Create QuickJS Wasm sandbox (memory limit: 128MB)
        │
        ▼
Configure: fetch enabled, console.log bridge, input as env
        │
        ▼
Execute user code (timeout: 5s)
        │
        ▼
Return output or error
        │
        ▼
Sandbox disposed
```

### Security Boundaries

| Allowed | Blocked |
|---|---|
| `fetch` (built-in, host-controlled) | `require`, `import` (host modules) |
| `input` object (passed via env) | `process`, `global` (host) |
| `JSON`, `Math`, standard JS built-ins | File system (`fs`, `path`) |
| `console.log` (via bridge) | Environment variables (host) |
| Nothing else | Network listeners / servers |
| | Access to other sandboxes / users |

### Resource Limits

| Resource | Limit |
|---|---|
| Memory | 128 MB per execution |
| Execution time | 5,000 ms (5 seconds) |
| Max stack size | Default (QuickJS managed) |

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Code throws an error | Caught, returned as `{ ok: false, error: "..." }` |
| Timeout exceeded (5s) | QuickJS terminates execution, returns timeout error |
| Memory exceeded (128MB) | QuickJS kills sandbox, returns memory error |
| Invalid JavaScript syntax | Caught at eval, returned as parse error |
| Fetch fails (network error) | Error propagated to sandbox as exception |

---

## Future Considerations

Not in scope for MVP.

- Sandbox pooling
- Fetch allowlist
- Rate limiting
- Response size limits
- Secrets injection
- Non-JSON responses
