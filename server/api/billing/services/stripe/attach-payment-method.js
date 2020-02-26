const stripe = require('../../../../config/stripe');
const { ApiError } = require('../../../../config/error');

async function attachPaymentMethod({ paymentMethodId, customerStripeId }) {
	try {
		const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
			customer: customerStripeId
		});
		return paymentMethod.id;
	} catch (error) {
		// should parse error ~
		console.log(error);
		throw new ApiError('BILLING_INVALID_PAYMENT_METHOD');
	}
}

module.exports = attachPaymentMethod;
