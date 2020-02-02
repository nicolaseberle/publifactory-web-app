const serviceUpload = require("../services/upload");

async function upload(req, res, next) {
	try {
		if (!req.body.avatar) throw { code: 422, message: "Missing parameters." };
		const response = await serviceUpload({
			userId: req.decoded._id,
			// filePath: req.filePath,
			// urlPath: req.urlPath
			avatar: req.body.avatar
		});
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = upload;
