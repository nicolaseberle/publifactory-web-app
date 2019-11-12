async function logo(req, res, next) {
	const blankPixelFile = `${__dirname.slice(
		0,
		__dirname.indexOf('controllers')
	)}assets/logo-publifactory.png`;
	try {
		return res.status(200).sendFile(blankPixelFile);
	} catch (error) {
		next(error);
	}
}

module.exports = logo;
