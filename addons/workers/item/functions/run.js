import workers from '#workers/addon.js';

workers.Fn('item.run', async function(item, code, input = {})
{
	const runner = item.Get('runner');
	const logs = [];

	item.Set('status', 'busy');

	try
	{
		const result = await runner(
			async ({ evalCode }) => evalCode(code),
			{
				allowFetch: true,
				allowFs: false,
				executionTimeout: 10000,
				memoryLimit: 16 * 1024 * 1024,
				env: input,
				console:
				{
					log: (...args)   => logs.push({ level: 'log', args }),
					error: (...args) => logs.push({ level: 'error', args }),
					warn: (...args)  => logs.push({ level: 'warn', args }),
				},
			},
		);

		if(!result.ok)
		{
			throw new Error(result.error?.message || 'Execution failed.');
		}

		return { output: result.data || null, logs };
	}
	catch(error)
	{
		throw error;
	}
	finally
	{
		item.Set('status', 'idle');
	}
});
