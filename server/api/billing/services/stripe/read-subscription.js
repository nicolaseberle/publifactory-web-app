const stripe = require('../../../../config/stripe');

async function createSubscription(subscriptionId) {
	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		return subscription;
	} catch (error) {
		console.log('ERROR CREATE SUBSCRIPTIOn=>', error);
		throw error;
	}
}

module.exports = createSubscription;
