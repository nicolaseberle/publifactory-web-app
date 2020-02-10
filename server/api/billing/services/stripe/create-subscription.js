const stripe = require('../../../../config/stripe');

async function createSubscription({ customerStripeId, planStripeId }) {
	try {
		const subscription = await stripe.subscriptions.create({
			customer: customerStripeId,
			items: [{ plan: planStripeId }]
		});
		return subscription;
	} catch (error) {
		console.log('ERROR CREATE SUBSCRIPTIOn=>', error);
	}
}

module.exports = createSubscription;
