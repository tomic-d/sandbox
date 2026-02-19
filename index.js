import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import commands from 'divhunt/commands';
import '#workers/load.js';

/* Load .env */
process.loadEnvFile(resolve(dirname(fileURLToPath(import.meta.url)), '.env'));

/* Start HTTP server */
commands.Fn('http.server', 3000, {
	onStart: () => console.log(`Sandbox running on :3000`),
});
