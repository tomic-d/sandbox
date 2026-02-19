import commands from 'divhunt/commands';
import workers from '#workers/addon.js';

commands.Item({
	id: 'workers:run',
	method: 'POST',
	endpoint: '/api/workers/run',
	exposed: true,
	in: {
		code: ['string', null, true],
		input: ['object', {}],
	},
	callback: async function(properties, resolve)
	{
		const worker = workers.Fn('acquire');

		if(!worker)
		{
			return resolve(null, 'No available workers', 503);
		}

		const result = await worker.Fn('run', properties.code, properties.input);

		resolve(result);
	},
});
