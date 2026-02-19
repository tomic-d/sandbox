import divhunt from 'divhunt';
import workers from '#workers/addon.js';

divhunt.AddonReady('workers', () =>
{
	const count = parseInt(process.env.WORKERS) || 10;

	for(let i = 0; i < count; i++)
	{
		workers.Item({ id: `worker-${i + 1}` });
	}
});
