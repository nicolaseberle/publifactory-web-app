const stripe = require('../../../../config/stripe');

async function updateCustomer(customerStripeId, customer) {
	const updatedCustomer = await stripe.customers.update(
		customerStripeId,
		customer
	);
	return updatedCustomer;
}

module.exports = updateCustomer;
