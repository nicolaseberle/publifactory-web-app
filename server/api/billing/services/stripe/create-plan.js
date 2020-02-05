const stripe = require('../../../../config/stripe');
const { planStripeId } = require('../../model');

//! \\ Should not be called unless it is deleted from stipe dashboard
async function createPlan(billing) {
	// if (!billing.productStripeId)
	try {
		const plan = await stripe.plans.retrieve(planStripeId);
		return plan;
	} catch (error) {
		console.log('ERROR=>', error);
		if (error.statusCode === 404 && error.code === 'resource_missing') {
			const plan = await stripe.plans.create({
				currency: billing.currency,
				interval: billing.interval,
				product: billing.productStripeId,
				nickname: 'requests plan',
				// eslint-disable-next-line
				aggregate_usage: 'sum',
				amount: 1,
				// eslint-disable-next-line
				usage_type: 'metered'
			});
			return plan;
		}
	}
}

module.exports = createPlan;
