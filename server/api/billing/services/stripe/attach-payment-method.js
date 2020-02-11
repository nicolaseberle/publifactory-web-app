const stripe = require('../../../../config/stripe');
const { ApiError } = require('../../../../config/error');

async function attachPayementMethod({ payementMethodId, customerStripeId }) {
	try {
		const payementMethod = await stripe.paymentMethods.attach(
			payementMethodId,
			{
				customer: customerStripeId
			}
		);
		return payementMethod.id;
	} catch (error) {
		// should parse error ~
		throw new ApiError('BILLING_INVALID_PAYMENT_METHOD');
	}
}

module.exports = attachPayementMethod;
