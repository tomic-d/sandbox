import divhunt from 'divhunt';
import commands from 'divhunt/commands';
import workers from '#workers/addon.js';

commands.Item({
	id: 'workers:run',
	method: 'POST',
	endpoint: '/api/workers/run',
	exposed: true,
	in: {
		code: ['string', null, true],
		input: ['object', null, true],
		schema: ['object', null, true],
	},
	callback: async function(properties, resolve)
	{
		const { code, input, schema } = properties;

		/* Validate schema structure */
		if(!schema.input || typeof schema.input !== 'object')
		{
			return resolve(null, 'schema.input is required and must be an object', 400);
		}

		if(!schema.output || typeof schema.output !== 'object')
		{
			return resolve(null, 'schema.output is required and must be an object', 400);
		}

		/* Validate input against schema */
		try
		{
			divhunt.DataDefine(input, schema.input);
		}
		catch(error)
		{
			return resolve(null, `Input validation failed: ${error.message}`, 400);
		}

		/* Acquire worker */
		const worker = workers.Fn('acquire');

		if(!worker)
		{
			return resolve(null, 'No available workers', 503);
		}

		/* Execute */
		const result = await worker.Fn('run', code, input);

		/* Validate output against schema */
		if(result.ok && result.data !== null)
		{
			try
			{
				const output = typeof result.data === 'object' ? result.data : { value: result.data };
				divhunt.DataDefine(output, schema.output);
				result.data = output;
			}
			catch(error)
			{
				return resolve(null, `Output validation failed: ${error.message}`, 422);
			}
		}

		resolve(result);
	},
});
