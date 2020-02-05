const stripe = require('../../../../config/stripe');

async function incrementPlan(billing) {
	const increment = await stripe.subscriptionItems.createUsageRecord(
		billing.planStripeId,
		{
			quantity: 1,
			timestamp: 1522893428,
			action: 'increment'
		}
	);
	console.log('increment=>', increment);
}

module.exports = incrementPlan;
