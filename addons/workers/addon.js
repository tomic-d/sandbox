import onetype from 'onetype';

const workers = onetype.Addon('workers', (addon) =>
{
	addon.Field('id',      ['string|number']);
	addon.Field('status',  ['string', 'idle']);
	addon.Field('runner',  ['function', null]);
});

export default workers;
