const stripe = require('../../../../config/stripe');

async function readInvoice(invoiceId) {
	try {
		const invoice = await stripe.invoices.retrieve(invoiceId);
		return invoice;
	} catch (error) {
		console.log('ERROR=>', error);
		throw error;
	}
}

module.exports = readInvoice;
