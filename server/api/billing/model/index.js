const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema(
	{
		// email: { type: String },
		curstomerStripeId: { type: String, default: null },
		payementMethodId: { type: String, default: null },
		confirmMethod: { type: String, default: 'automatic' },
		freemium: Boolean, // turn to false on request.length >= 10
		currency: { type: String, default: 'EUR' },
		amount: { type: Number, default: 2 },
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
