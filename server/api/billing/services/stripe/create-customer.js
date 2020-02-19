const stripe = require('../../../../config/stripe');

async function createCustomer({
	email,
	fullName,
	payementMethodId = undefined
}) {
	// stripe empty field
	const customer = {
		email,
		name: fullName
	};
	if (payementMethodId) customer.payment_method = payementMethodId;
	const newCustomer = await stripe.customers.create(customer);
	return newCustomer;
}

module.exports = createCustomer;
