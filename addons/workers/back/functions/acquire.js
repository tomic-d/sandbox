import workers from '#workers/addon.js';

workers.Fn('acquire', function()
{
	const items = Object.values(workers.Items());

	for(const item of items)
	{
		if(item.Get('status') === 'idle')
		{
			item.Set('status', 'busy');
			return item;
		}
	}

	return null;
});
