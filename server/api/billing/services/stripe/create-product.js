const stripe = require('../../../../config/stripe');
const { planStripeId } = require('../../model');

//! \\ Should not be called unless it is deleted from stipe dashboard
async function createProduct() {
	try {
		const product = await stripe.products.retrieve(planStripeId);
		return product;
	} catch (error) {
		console.log('ERROR=>', error);
		if (error.statusCode === 404 && error.code === 'resource_missing') {
			const product = await stripe.products.create({
				name: 'Request invitation',
				type: 'service',
				description: 'This is a description of the request invitation',
				// eslint-disable-next-line
				statement_descriptor: 'PUBLIFACTORY',
				// eslint-disable-next-line
				unit_label: 'requests'
			});
			return product;
		}
	}
}

module.exports = createProduct;
