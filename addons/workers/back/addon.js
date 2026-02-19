import divhunt from 'divhunt';

const workers = divhunt.Addon('sandbox.workers', (addon) =>
{
	addon.Field('id',      ['string|number']);
	addon.Field('status',  ['string', 'idle']);
	addon.Field('runner',  ['function', null]);
});

export default workers;
