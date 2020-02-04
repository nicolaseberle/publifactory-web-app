const stripe = require('../../../../config/stripe');

async function createSubscription({ customerId, plandId }) {
	stripe.subscriptions.create({
		customer: customerId,
		items: [{ plan: plandId }]
	});
}

module.exports = createSubscription;
