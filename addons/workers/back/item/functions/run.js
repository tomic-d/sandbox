import workers from '#workers/addon.js';

workers.Fn('item.run', async function(item, code, input = {})
{
	const engine = await workers.Fn('init');
	const logs = [];

	item.Set('status', 'busy');

	try
	{
		const result = await engine.runSandboxed(
			async ({ evalCode }) => evalCode(code),
			{
				allowFetch: true,
				allowFs: false,
				executionTimeout: 5000,
				memoryLimit: 128 * 1024 * 1024,
				env: input,
				console:
				{
					log: (...args) => logs.push({ level: 'log', args }),
					error: (...args) => logs.push({ level: 'error', args }),
					warn: (...args) => logs.push({ level: 'warn', args }),
				},
			},
		);

		return { ok: result.ok, data: result.data || null, error: result.ok ? null : result.error, logs };
	}
	catch(error)
	{
		return { ok: false, data: null, error: error.message, logs };
	}
	finally
	{
		item.Set('status', 'idle');
	}
});
