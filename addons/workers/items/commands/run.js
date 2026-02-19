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
		schema: {
			type: 'object',
			required: true,
			config: {
				input: ['object', null, true],
				output: ['object', null, true],
			},
		},
	},
	out: {
		output: ['object'],
		logs: ['array'],
	},
	callback: async function(properties, resolve)
	{
		const { code, input, schema } = properties;

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
		let result;

		try
		{
			result = await worker.Fn('run', code, input);
		}
		catch(error)
		{
			return resolve(null, error.message, 500);
		}

		/* Validate output against schema */
		if(result.output !== null)
		{
			try
			{
				const output = typeof result.output === 'object' ? result.output : { value: result.output };
				divhunt.DataDefine(output, schema.output);
				result.output = output;
			}
			catch(error)
			{
				return resolve(null, `Output validation failed: ${error.message}`, 422);
			}
		}

		resolve(result);
	},
});
