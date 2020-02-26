const stripe = require('../../../../config/stripe');

async function readCustomer(customerStripeId) {
	const newCustomer = await stripe.customers.retrieve(customerStripeId);
	return newCustomer;
}

module.exports = readCustomer;
