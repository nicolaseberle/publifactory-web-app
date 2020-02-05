const Stripe = require('stripe');

const stripeKey = require('../../../config').stripe.privateKey;
const stripe = Stripe(stripeKey);

module.exports = stripe;
