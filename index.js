import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import commands from 'divhunt/commands';
import workers from '#workers/load.js';

/* Load .env */
process.loadEnvFile(resolve(dirname(fileURLToPath(import.meta.url)), '.env'));

/* Spin up worker pool */
const count = parseInt(process.env.WORKERS) || 3;

for(let i = 0; i < count; i++)
{
	workers.Item({ id: `worker-${i + 1}` });
}

/* Wait for all workers to be ready */
await new Promise((resolve) =>
{
	const check = () =>
	{
		const items = Object.values(workers.Items());
		const ready = items.every(item => item.Get('status') === 'idle');

		if(ready)
		{
			resolve();
		}
		else
		{
			setTimeout(check, 100);
		}
	};

	check();
});

/* Start HTTP server */
commands.Fn('http.server', 3000, {
	onStart: () => console.log(`Sandbox running on :3000 (${count} workers)`),
});

export default workers;
