const stripe = require('../../../../config/stripe');

async function createSubscription(subscriptionId) {
	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		const itemsub = await stripe.subscriptionItems.retrieve(
			'si_GiL2eBUK58b9e5'
		);
		console.log('ITEMMSUB=>', JSON.stringify(itemsub));
		return subscription;
	} catch (error) {
		console.log('ERROR CREATE SUBSCRIPTIOn=>', error);
	}
}

module.exports = createSubscription;
