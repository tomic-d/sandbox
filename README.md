# Divhunt Sandbox

Secure JavaScript execution environment for untrusted code using QuickJS WebAssembly sandbox.

Built for the [Divhunt Agents](https://github.com/tomic-d/agents) platform — executes user-written JavaScript callbacks in isolated V8-independent sandboxes with controlled HTTP access.

## Features

- **Isolated execution** — QuickJS compiled to WebAssembly, no access to host
- **Built-in fetch** — HTTP requests from sandbox to external APIs
- **Console.log bridge** — Captures logs from sandbox for debugging
- **Worker pool** — Multiple sandbox workers with automatic acquire/release
- **Resource limits** — Memory (128MB) and execution timeout (5s)
- **HTTP API** — Single endpoint to execute code via curl

## Quick Start

```bash
npm install
node index.js
```

```
Sandbox running on :3000
```

## API

### POST /api/workers/run

Execute JavaScript code in a sandbox.

**Request:**

```json
{
  "code": "export default 2 + 2",
  "input": {}
}
```

**Response:**

```json
{
  "data": {
    "ok": true,
    "data": 4,
    "error": null,
    "logs": []
  },
  "code": 200
}
```

### Examples

**Basic computation:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "export default 2 + 2"}'
```

**Using input:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "export default \"Hello \" + env.name", "input": {"name": "Dejan"}}'
```

**Fetch external API:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "const r = await fetch(\"https://httpbin.org/get\"); const d = await r.json(); export default d.url"}'
```

**Console.log:**

```bash
curl -X POST http://localhost:3000/api/workers/run \
  -H 'Content-Type: application/json' \
  -d '{"code": "console.log(\"debug\"); export default \"done\""}'
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
│   ├── init.js           — QuickJS engine singleton
│   └── acquire.js        — Gets first idle worker
├── item/functions/
│   └── run.js            — Executes code in sandbox
└── items/commands/
    └── run.js            — POST /api/workers/run
```

## Built With

- [Divhunt Framework](https://github.com/tomic-d/framework)
- [@sebastianwessel/quickjs](https://github.com/sebastianwessel/quickjs) — QuickJS WebAssembly sandbox
- [quickjs-emscripten](https://github.com/nicolo-ribaudo/quickjs-emscripten) — QuickJS engine

## License

MIT
