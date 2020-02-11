const mongoose = require('mongoose');
const { stripe } = require('../../../../config');
const { readSubscription, readInvoice } = require('../services/stripe/');

const productStripeId = stripe.productId;
const planStripeId = stripe.freemiumPlanId;

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
		plan: {
			type: String,
			default: 'freemium',
			enum: { values: ['freemium', 'premium'] }
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
	const { ...invoice } = await readInvoice(subscription.latest_invoice);
	const {
		status,
		quantity,
		current_period_end, // eslint-disable-line
		current_period_start, // eslint-disable-line
		canceled_at // eslint-disable-line
	} = subscription;
	return {
		invoice,
		status,
		quantity,
		current_period_end, // eslint-disable-line
		current_period_start, // eslint-disable-line
		canceled_at // eslint-disable-line
	};
});

module.exports.Billing = mongoose.model('Billing', BillingSchema);
module.exports.BillingSchema = BillingSchema;
module.exports.productStripeId = productStripeId;
module.exports.planStripeId = planStripeId;
