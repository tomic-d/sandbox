import variant from '@jitl/quickjs-ng-wasmfile-release-sync';
import { loadQuickJs } from '@sebastianwessel/quickjs';
import workers from '#workers/addon.js';

let engine = null;

workers.Fn('init', async function()
{
	if(engine)
	{
		return engine;
	}

	engine = await loadQuickJs(variant);

	return engine;
});
