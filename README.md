# Sandbox

Secure JavaScript execution environment for untrusted code using QuickJS WebAssembly sandbox.

Built for the [Agents](https://github.com/tomic-d/agents) platform — runs user-written JavaScript callbacks in isolated sandboxes with controlled HTTP access.

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
    "code": 200
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
    }
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
