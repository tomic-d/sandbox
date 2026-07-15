# Sandbox

**Run code you don't trust, safely.** A secure execution environment for untrusted JavaScript, built on a QuickJS WebAssembly sandbox.

The moment an AI agent or a user can write code that your server runs, you have a problem: that code could read your files, hit your network, or crash your process. This solves it. Untrusted code runs fully isolated inside WebAssembly — it gets exactly the capabilities you hand it (input data, controlled HTTP) and nothing else. No filesystem, no `process`, no `require`.

Built by [Dejan Tomic](https://github.com/tomic-d) for the [Agents](https://github.com/tomic-d/agents) orchestrator, to run model-generated callbacks without ever trusting them. A pooled set of workers keeps it fast under load.

## Quick Start

```bash
npm install
node index.js
```

## API

### POST /api/workers/run

Executes JavaScript code in an isolated sandbox worker.

| Field | Type | Description |
|---|---|---|
| `code` | string | JavaScript code to execute. Must `export default` a return value. |
| `input` | object | Data passed to the sandbox, accessible via `env`. |
| `schema.input` | object | Validates `input` before execution. Keys are field names, values are type definitions. |
| `schema.output` | object | Validates the return value after execution. Same format as input schema. |

**Example request:**

```json
{
    "code": "export default env.price * env.quantity",
    "input": { "price": 10, "quantity": 3 },
    "schema": {
        "input": {
            "price": ["number", null, true],
            "quantity": ["number", null, true]
        },
        "output": {
            "value": ["number"]
        }
    }
}
```

Schema format follows [DataDefine](https://github.com/tomic-d/framework) — `["type", default, required]`.

**Response:**

```json
{
    "data": {
        "output": { "value": 30 },
        "logs": []
    },
    "message": "Command 'workers:run' executed successfully.",
    "code": 200,
    "time": "22.21"
}
```

- `output` — validated return value (wrapped in `{ value }` for primitives)
- `logs` — captured `console.log/warn/error` calls from sandbox

### GET /api/workers/status

Returns worker pool status.

```json
{
    "data": {
        "total": 10,
        "idle": 9,
        "busy": 1,
        "loading": 0
    },
    "message": "Command 'workers:status' executed successfully.",
    "code": 200,
    "time": "0.85"
}
```

## Sandbox Environment

Code runs in a QuickJS WebAssembly sandbox. Available inside:

- `env` — input data object
- `fetch` — HTTP requests to external APIs
- `console.log/warn/error` — captured and returned in `logs`
- Standard JS built-ins (`JSON`, `Math`, `Date`, etc.)

Not available: `require`, `import`, `process`, filesystem, network listeners.

## Configuration

`.env` file:

```
WORKERS=10
```

## License

MIT
