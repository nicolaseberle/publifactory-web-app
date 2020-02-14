const stripe = require('../../../../config/stripe');

async function createCustomer(customerStripeId) {
	const newCustomer = await stripe.customers.retrieve(customerStripeId);
	return newCustomer;
}

module.exports = createCustomer;
