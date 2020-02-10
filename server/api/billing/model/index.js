const mongoose = require('mongoose');
const { stripe } = require('../../../../config');

const productStripeId = stripe.productId;
const planStripeId = stripe.planId;

const BillingSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		lastName: { type: String, required: true },
		firstName: { type: String, required: true },
		customerStripeId: { type: String, default: null },
		subscriptionId: { type: String, default: null },
		subscriptionItemId: { type: String, default: null },
		payementMethodId: { type: String, default: null },
		confirmMethod: { type: String, default: 'automatic' },
		productStripeId: { type: String, default: productStripeId },
		planStripeId: { type: String, default: planStripeId },
		freemium: Boolean, // turn to false on request.length >= 10
		// amount: { type: Number, default: 2 },
		currency: { type: String, default: 'EUR' },
		interval: {
			type: String,
			default: 'day',
			enum: { values: ['day', 'week', 'month', 'year'] }
		},

		requests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Request'
			}
		]
	},
	{ timestamps: true }
);

module.exports.Billing = mongoose.model('Billing', BillingSchema);
module.exports.BillingSchema = BillingSchema;
module.exports.productStripeId = productStripeId;
module.exports.planStripeId = planStripeId;

/**
 * Freemium (N / 10)
 * => no account => to accounts => cookies => Freemium
 */

/**
 * Payement
 */

/**
 *
 * Billing: {
 *  information: ...{~User || Journal},
 *  customerStripeId: String
 *  freemium: Boolean.
 *  ...StripeInfo(CARTE//),
 *  amount: Number
 *  currency: '€'
 *  confirm_method: String
 *  Request: [
 *    ...Schema{Request},
 *    payement: Enum('paid'|'unpaid'|'free'),
 *    payementMethodId: String
 *  ]
 * }
 *
 */
