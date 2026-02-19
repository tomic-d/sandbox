import variant from '@jitl/quickjs-ng-wasmfile-release-sync';
import { loadQuickJs } from '@sebastianwessel/quickjs';
import workers from '#workers/addon.js';

workers.ItemOn('add', function(item)
{
	item.Set('status', 'loading');

	loadQuickJs(variant).then((engine) =>
	{
		item.Set('runner', engine.runSandboxed);
		item.Set('status', 'idle');
	});
});
