const stripe = require('../../../../config/stripe');

async function readNextInvoice({ customerStripeId, subscriptionId }) {
	try {
		const invoice = await stripe.invoices.retrieveUpcoming({
			customer: customerStripeId,
			subscription: subscriptionId
		});

		return invoice;
	} catch (error) {
		console.log('ERROR=>', error);
		throw error;
	}
}

module.exports = readNextInvoice;
