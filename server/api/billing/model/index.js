const mongoose = require('mongoose');
const { stripe } = require('../../../../config');
const { readSubscription, readInvoice } = require('../services/stripe/');

const productStripeId = stripe.productId;
const planStripeId = stripe.planId;

const BillingSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		fullName: { type: String, required: true },
		customerStripeId: { type: String, default: null },
		subscriptionId: { type: String, default: null },
		subscriptionItemId: { type: String, default: null },
		payementMethodId: { type: String, default: null },
		confirmMethod: { type: String, default: 'automatic' },
		productStripeId: { type: String, default: productStripeId },
		planStripeId: { type: String, default: planStripeId },
		freemium: Boolean, // turn to false on request.length >= 10
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

BillingSchema.virtual('subscription').get(async function() {
	const subscription = await readSubscription(this.subscriptionId);
	const invoice = await readInvoice(subscription.latest_invoice);
	subscription.latest_invoice = invoice;
	return subscription;
});

module.exports.Billing = mongoose.model('Billing', BillingSchema);
module.exports.BillingSchema = BillingSchema;
module.exports.productStripeId = productStripeId;
module.exports.planStripeId = planStripeId;
