const Stripe = require('stripe');
const stripeKey = require('../../../config').stripe.private_key;
const stripe = Stripe(stripeKey);

module.exports = stripe;
