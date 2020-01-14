const serviceCreate = require("../services/create");

async function create(req, res, next) {
	try {
		if (
			!req.body.reviewer ||
			!req.body.editor ||
			!req.body.object ||
			!req.body.content
		) {
			throw { code: 422, message: "Missing parameters." };
		}
		const response = await serviceCreate(req.body);

		// case of user not logged in =>
		if (!req.decoded) {
			const { maxInvitation } = req.cookies;
			// case of no cookie
			if (!maxInvitation) {
				return res
					.status(200)
					.cookie("maxInvitation", "1", {
						httpOnly: true,
						// secure: true,
						maxAge: 31536000
					})
					.json({ ...response, invitationNumber: 1 })
					.end();
			} else if (parseInt(maxInvitation, 10) >= 10) {
				return res
					.status(403)
					.json({ success: false, message: "MAX_INVITATION_NUMBER" })
					.end();
			} else {
				const invitationNumber = parseInt(maxInvitation, 10) + 1;
				return res
					.status(200)
					.cookie("maxInvitation", invitationNumber, {
						httpOnly: true,
						// secure: true,
						maxAge: 31536000
					})
					.json({ ...response, invitationNumber })
					.end();
			}
		}
		return res
			.status(200)
			.json(response)
			.end();
	} catch (error) {
		return next(error);
	}
}

module.exports = create;
