const stripe = require('../../../../config/stripe');

async function upgradeSubscriptionPlan({
	subscriptionId,
	payementMethodId,
	premiumPlanId
}) {
	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		const updatedSubscription = await stripe.subscriptions.update(
			subscription.id,
			{
				cancel_at_period_end: false, // eslint-disable-line
				default_payment_method: payementMethodId, // eslint-disable-line
				proration_behavior: 'none', // eslint-disable-line

				items: [
					{
						id: subscription.items.data[0].id,
						plan: premiumPlanId
					}
				]
			}
		);
		return updatedSubscription;
	} catch (error) {
		console.log('ERROR INCREMENT=>', error);
	}
}

module.exports = upgradeSubscriptionPlan;
