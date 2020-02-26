const stripe = require('../../../../config/stripe');

async function createCustomer({
	email,
	fullName,
	paymentMethodId = undefined
}) {
	// stripe empty field
	const customer = {
		email,
		name: fullName
	};
	if (paymentMethodId) customer.payment_method = paymentMethodId;
	const newCustomer = await stripe.customers.create(customer);
	return newCustomer;
}

module.exports = createCustomer;
