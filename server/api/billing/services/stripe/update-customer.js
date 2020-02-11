const stripe = require('../../../../config/stripe');

async function updateCustomer(customerStripeId, customer) {
	const updatedCustomer = await stripe.update.retrieve(
		customerStripeId,
		customer
	);
	return updatedCustomer;
}

module.exports = updateCustomer;
