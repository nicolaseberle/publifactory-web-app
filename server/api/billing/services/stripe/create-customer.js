const stripe = require('../../../../config/stripe');

async function createCustomer({
	email,
	lastName,
	payementMethodId = undefined
}) {
	// stripe empty field
	const customer = {
		email,
		name: lastName
	};
	if (payementMethodId) customer.payment_method = payementMethodId;
	const newCustomer = await stripe.customers.create(customer);
	return newCustomer;
}

module.exports = createCustomer;
