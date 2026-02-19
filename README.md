# Divhunt Sandbox

Secure JavaScript execution environment for untrusted code using QuickJS WebAssembly sandbox.

Built for the [Divhunt Agents](https://github.com/tomic-d/agents) platform.

## Quick Start

```bash
npm install
node index.js
```

## API

### POST /api/workers/run

```json
{
  "code": "export default 2 + 2",
  "input": {},
  "schema": {
    "input": {},
    "output": { "value": ["number"] }
  }
}
```

### GET /api/workers/status

Returns worker pool status (total, idle, busy, loading).

## Configuration

```
WORKERS=10
```

## License

MIT
