const mongoose = require('mongoose');
const { stripe } = require('../../../../config');
const {
	readSubscription,
	readInvoice,
	readNextInvoice
} = require('../services/stripe/');

const productStripeId = stripe.freemiumProductId;
const planStripeId = stripe.freemiumPlanId;

const BillingSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		fullName: { type: String, required: true },
		customerStripeId: { type: String, default: null },
		subscriptionId: { type: String, default: null },
		subscriptionFreemiumId: { type: String, default: null },
		subscriptionItemId: { type: String, default: null },
		paymentMethodId: { type: String, default: null },
		confirmMethod: { type: String, default: 'automatic' },
		productStripeId: { type: String, default: productStripeId },
		planStripeId: { type: String, default: planStripeId },
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
	if (!this.subscriptionId) return null;
	const subscription = await readSubscription(this.subscriptionId);
	const { ...invoice } = await readInvoice(subscription.latest_invoice);
	const { ...nextInvoice } = await readNextInvoice({
		customerStripeId: this.customerStripeId,
		subscriptionId: this.subscriptionId
	});
	const quantity = nextInvoice.lines.data[0].quantity;
	const {
		status,
		current_period_end, // eslint-disable-line
		current_period_start, // eslint-disable-line
		canceled_at // eslint-disable-line
	} = subscription;
	return {
		quantity,
		nextInvoice,
		invoice,
		status,
		current_period_end, // eslint-disable-line
		current_period_start, // eslint-disable-line
		canceled_at // eslint-disable-line
	};
});

module.exports.Billing = mongoose.model('Billing', BillingSchema);
module.exports.BillingSchema = BillingSchema;
module.exports.productStripeId = productStripeId;
module.exports.planStripeId = planStripeId;
