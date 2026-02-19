import commands from 'divhunt/commands';
import workers from '#workers/load.js';

/* Spin up worker pool */
const count = 3;

for(let i = 0; i < count; i++)
{
	workers.Item({ id: `worker-${i + 1}` });
}

/* Init engine */
await workers.Fn('init');

/* Start HTTP server */
commands.Fn('http.server', 3000, {
	onStart: () => console.log('Sandbox running on :3000'),
});

export default workers;
