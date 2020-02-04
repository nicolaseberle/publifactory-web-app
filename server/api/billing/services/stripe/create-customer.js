const stripe = require('../../../../config/stripe');

async function createCustomer(billing) {
	const customer = await stripe.customers.create({
		email: billing.email,
		name: billing.lastname
	});
	billing.customerStripeId = customer.id;
	await billing.save();
}

module.exports = createCustomer;
