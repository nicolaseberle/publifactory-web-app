const stripe = require('../../../../config/stripe');

async function createProduct() {
	const product = await stripe.products.create({
		name: 'Request invitation',
		type: 'service',
		description: 'This is a description of the request invitation',
		// eslint-disable-next-line
		statement_descriptor: 'PUBLIFACTORY REVIEW'
	});
	console.log('==>product', product);
}

module.exports = createProduct;
