# Divhunt Sandbox

Secure JavaScript execution environment for untrusted code using QuickJS WebAssembly sandbox.

Built for the [Divhunt Agents](https://github.com/tomic-d/agents) platform — executes user-written JavaScript callbacks in isolated sandboxes with controlled HTTP access.

## Features

- **Isolated execution** — QuickJS compiled to WebAssembly, per-worker engine isolation
- **Built-in fetch** — HTTP requests from sandbox to external APIs
- **Console.log bridge** — Captures log/warn/error from sandbox for debugging
- **Worker pool** — Configurable pool with automatic acquire/release
- **Resource limits** — Memory (16MB) and execution timeout (10s)
- **Schema validation** — Mandatory input/output schema enforcement
- **HTTP API** — Execute code and check worker status

## Quick Start

```bash
npm install
node index.js
```

```
Sandbox running on :3000 (10 workers)
```

Configure worker count via `.env`:

```
WORKERS=10
```

## API

### POST /api/workers/run

Execute JavaScript code in a sandbox.

**Request:**

```json
{
  "code": "export default 2 + 2",
  "input": {},
  "schema": {
    "input": {},
    "output": {
      "value": ["number"]
    }
  }
}
```

**Response:**

```json
{
  "data": {
    "output": { "value": 4 },
    "logs": []
  },
  "code": 200
}
```

### GET /api/workers/status

Check worker pool status.

**Response:**

```json
{
  "data": {
    "total": 10,
    "idle": 10,
    "busy": 0,
    "loading": 0,
    "workers": [
      { "id": "worker-1", "status": "idle" }
    ]
  },
  "code": 200
}
```

### Examples

**Basic computation:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "export default 2 + 2", "input": {}, "schema": {"input": {}, "output": {"value": ["number"]}}}'
```

**Using input:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "export default \"Hello \" + env.name", "input": {"name": "Dejan"}, "schema": {"input": {"name": ["string"]}, "output": {"value": ["string"]}}}'
```

**Fetch external API:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "const r = await fetch(\"https://httpbin.org/get\"); const d = await r.json(); export default d.url", "input": {}, "schema": {"input": {}, "output": {"value": ["string"]}}}'
```

**Console.log:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "console.log(\"debug\"); export default \"done\"", "input": {}, "schema": {"input": {}, "output": {"value": ["string"]}}}'
```

Logs are returned in the `logs` array of the response.

## Security

| Allowed | Blocked |
|---|---|
| `fetch` (HTTP requests) | `require`, `import` (host modules) |
| `env` object (from input) | `process`, `global` (host) |
| `JSON`, `Math`, JS built-ins | File system |
| `console.log/warn/error` | Environment variables (host) |
| | Network listeners / servers |

## Architecture

```
addons/workers/back/
├── addon.js              — Worker addon (id, status, runner)
├── load.js               — Wires everything together
├── functions/
│   └── acquire.js        — Gets first idle worker
├── item/functions/
│   ├── add.js            — Per-worker QuickJS engine init
│   └── run.js            — Executes code in sandbox
└── items/commands/
    ├── run.js            — POST /api/workers/run
    └── status.js         — GET /api/workers/status
```

## Built With

- [Divhunt Framework](https://github.com/tomic-d/framework)
- [@sebastianwessel/quickjs](https://github.com/sebastianwessel/quickjs) — QuickJS WebAssembly sandbox

## License

MIT
