const stripe = require('../../../../config/stripe');

async function chargePlan({ subscriptionItemId }) {
	try {
		const increment = await stripe.subscriptionItems.createUsageRecord(
			subscriptionItemId,
			{
				quantity: 1,
				timestamp: Math.floor(Date.now() / 1000),
				action: 'increment'
			}
		);
		return increment;
	} catch (error) {
		throw error;
	}
}

module.exports = chargePlan;
