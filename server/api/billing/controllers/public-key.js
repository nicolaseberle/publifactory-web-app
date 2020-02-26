const config = require('../../../../config');

async function publicKey(req, res, next) {
	return res
		.status(200)
		.json(config.stripe.publicKey)
		.end();
}

module.exports = publicKey;
