import commands from 'divhunt/commands';
import workers from '#workers/addon.js';

commands.Item({
	id: 'workers:status',
	method: 'GET',
	endpoint: '/api/workers/status',
	exposed: true,
	out: {
		total: ['number'],
		idle: ['number'],
		busy: ['number'],
		loading: ['number'],
		workers: ['array'],
	},
	callback: async function(properties, resolve)
	{
		const items = Object.values(workers.Items());
		let idle = 0;
		let busy = 0;
		let loading = 0;
		const list = [];

		for(const item of items)
		{
			const status = item.Get('status');

			if(status === 'idle') idle++;
			else if(status === 'busy') busy++;
			else if(status === 'loading') loading++;

			list.push({ id: item.Get('id'), status });
		}

		resolve({ total: items.length, idle, busy, loading, workers: list });
	},
});
