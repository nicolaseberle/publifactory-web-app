const stripe = require('../../../../config/stripe');

async function updateCustomer(
	customerStripeId,
	{ email = undefined, fullName = undefined, paymentMethodId = undefined }
) {
	const customer = {};
	if (email) customer.email = email;
	if (fullName) customer.name = fullName;
	if (paymentMethodId) customer.paymentMethodId = paymentMethodId;
	const updatedCustomer = await stripe.customers.update(
		customerStripeId,
		customer
	);
	return updatedCustomer;
}

module.exports = updateCustomer;
