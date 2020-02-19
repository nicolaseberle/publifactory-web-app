const stripe = require('../../../../config/stripe');

async function readSubscription(subscriptionId) {
	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		return subscription;
	} catch (error) {
		console.log('ERROR CREATE SUBSCRIPTIOn=>', error);
		throw error;
	}
}

module.exports = readSubscription;
