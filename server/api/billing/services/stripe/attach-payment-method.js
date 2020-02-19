const stripe = require('../../../../config/stripe');
const { ApiError } = require('../../../../config/error');

async function attachPayementMethod({ paymentMethodId, customerStripeId }) {
	try {
		const payementMethod = await stripe.paymentMethods.attach(paymentMethodId, {
			customer: customerStripeId
		});
		return payementMethod.id;
	} catch (error) {
		// should parse error ~
		console.log(error);
		throw new ApiError('BILLING_INVALID_PAYMENT_METHOD');
	}
}

module.exports = attachPayementMethod;
