const jwt = require('jsonwebtoken');
const User = require('../user.model');
const { ApiError } = require('../../../config/error');
const config = require('../../../../config');

async function validateGuest({ token, password }) {
	try {
		const decoded = jwt.verify(token, config.backend.secrets.session);

		const user = User.findById(decoded._id);
		if (!user) throw new ApiError('USER_NOT_FOUND');
		const auth = user.authenticate(decoded.h);
		if (!auth) throw new ApiError('USER_WRONG_PASSWORD');
		user.role = 'user';
		const roles = user.roles.filter(role => role !== 'guest');
		user.roles = [...roles, 'user'];
		user.password = password;

		const token = jwt.sign(
			{
				_id: user._id,
				name: user.name,
				role: user.role
			},
			config.backend.secrets.session,
			{ expiresIn: '7d' }
		);

		return { token };
	} catch (error) {
		switch (error.constructor) {
			case jwt.TokenExpiredError:
				// should send back email
				throw new ApiError('VALIDATE_ACCOUNT_TOKEN_EXPIRED');
			case jwt.JsonWebTokenError:
				throw new ApiError('VALIDATE_ACCOUNTS_INVALID_TOKEN');
			case jwt.NotBeforeError:
				throw new ApiError('VALIDATE_ACCOUNTS_TOKEN_AHEAD_OF_TIME');
			default:
				throw error;
		}
	}
}

module.exports = validateGuest;
