const stripe = require('../../../../config/stripe');

async function updateCustomer(
	customerStripeId,
	{ email = undefined, fullName = undefined, payementMethodId = undefined }
) {
	let customer = {};
	if (email) customer.email = email;
	if (fullName) customer.name = fullName;
	if (payementMethodId) customer.payementMethodId = payementMethodId;
	const updatedCustomer = await stripe.customers.update(
		customerStripeId,
		customer
	);
	return updatedCustomer;
}

module.exports = updateCustomer;
