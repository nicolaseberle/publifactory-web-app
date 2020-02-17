const stripe = require('../../../../config/stripe');

async function upgradeSubscriptionPlan({ subscriptionId }) {
	try {
		const subscription = await stripe.subscriptions.del(subscriptionId, {
			// eslint-disable-next-line
			invoice_now: true,
			prorate: true
		});
		return subscription;
	} catch (error) {
		console.log('ERROR INCREMENT=>', error);
		throw error;
	}
}

module.exports = upgradeSubscriptionPlan;
