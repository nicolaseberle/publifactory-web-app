const stripe = require('../../../../config/stripe');

async function createPlan(billing) {
	const plan = await stripe.plans.create({
		currency: billing.currency,
		interval: billing.interval,
		product: 'prod_GfpqjBUUknYSZi',
		nickname: 'Pro',
		amount: 1,
		// eslint-disable-next-line
		usage_type: 'metered'
	});
	console.log('plan=>', plan);
}

module.exports = createPlan;
