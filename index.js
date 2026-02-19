import commands from 'divhunt/commands';
import workers from '#workers/load.js';

/* Spin up worker pool */
const count = 3;

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
	onStart: () => console.log('Sandbox running on :3000'),
});

export default workers;
