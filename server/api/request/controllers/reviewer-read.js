const serviceUpdate = require('../services/update');

async function reviewerReponse(req, res, next) {
	const blankPixelFile = `${__dirname.slice(
		0,
		__dirname.indexOf('controllers')
	)}assets/blank-pixel.png`;
	try {
		await serviceUpdate(req.params.requestId, { status: 'read' });
		return res.status(200).sendFile(blankPixelFile);
	} catch (error) {
		return res.status(200).sendFile(blankPixelFile);
	}
}

module.exports = reviewerReponse;
