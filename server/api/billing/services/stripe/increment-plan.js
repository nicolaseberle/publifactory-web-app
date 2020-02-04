const stripe = require('../../../../config/stripe');

async function incrementPlan() {
	const planId = 'plan_Gfpx8bp2lRIuMz';

	const increment = await stripe.subscriptionItems.createUsageRecord(planId, {
		quantity: 1,
		timestamp: 1522893428,
		action: 'increment'
	});
	console.log('increment=>', increment);
}

module.exports = incrementPlan;
