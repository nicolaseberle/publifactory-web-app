const jwt = require("jsonwebtoken");
const config = require("../../../../config").backend;

// same as checkToken but doesn't fail when no token is provided
function optionalAuthentication(req, res, next) {
	const unparsedToken =
		req.body.token || req.params.token || req.headers["authorization"];
	if (unparsedToken) {
		const regExp = /Bearer (.*?)$/;
		const token = regExp.exec(unparsedToken)[1];
		try {
			const decoded = jwt.verify(token, config.secrets.session);
			req.decoded = decoded;
			return next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res
					.status(403)
					.json({ success: false, message: "Token expired" });
			}
			return res.status(403).json({
				success: false,
				message: "Failed to authenticate token."
			});
		}
	} else {
		// Not connected
		return next();
	}
}

module.exports = optionalAuthentication;
