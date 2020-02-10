const serviceCreate = require('../services/create');

const cookieConfig =
	process.env.NODE_ENV === 'development'
		? {
				// httpOnly: true,
				// secure: true,
				maxAge: 31536000
		  }
		: {
				// httpOnly: true,
				secure: true,
				maxAge: 31536000
		  };

async function create(req, res, next) {
	try {
		if (
			!req.body.reviewer ||
			!req.body.editor ||
			!req.body.object ||
			!req.body.content ||
			!req.params.billingId
		) {
			throw { code: 422, message: 'Missing parameters.' };
		}

		// case of user not logged in =>
		if (!req.decoded) {
			const { maxInvitation } = req.cookies;

			if (parseInt(maxInvitation, 10) >= 10) {
				return res
					.status(403)
					.json({ success: false, message: 'MAX_INVITATION_NUMBER' })
					.end();
			} else {
				const response = await serviceCreate(
					req.body,
					req.decoded._id,
					req.params.billingId
				);
				if (!maxInvitation) {
					return (
						res
							.status(200)
							.cookie('maxInvitation', '1', cookieConfig)
							// .cookie('billing', response.billing, cookieConfig)
							.json({ ...response, invitationNumber: 1 })
							.end()
					);
				} else {
					const invitationNumber = parseInt(maxInvitation, 10) + 1;
					return (
						res
							.status(200)
							.cookie('maxInvitation', invitationNumber, cookieConfig)
							// .cookie('billing', response.billing, cookieConfig)
							.json({ ...response, invitationNumber })
							.end()
					);
				}
			}
		}

		const response = await serviceCreate(
			req.body,
			req.decoded._id,
			req.params.billingId
		);

		return (
			res
				.status(200)
				.clearCookie('maxInvitation', { ...cookieConfig, path: '/' })
				// .clearCookie('billing', { ...cookieConfig, path: '/' })
				.json(response)
				.end()
		);
	} catch (error) {
		return next(error);
	}
}

module.exports = create;
