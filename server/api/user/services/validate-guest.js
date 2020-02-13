const jwt = require('jsonwebtoken');
const User = require('../user.model');
const { ApiError } = require('../../../config/error');
const config = require('../../../../config');

async function deleteAccount(user) {
	await User.findByIdAndRemove(user._id);
}

async function createAccount(user, password) {
	user.role = 'user';
	const roles = user.roles.filter(role => role !== 'guest');
	user.roles = [...roles, 'user'];
	user.password = password;

	const auToken = jwt.sign(
		{
			_id: user._id,
			name: user.name,
			role: user.role
		},
		config.backend.secrets.session,
		{ expiresIn: '7d' }
	);
	await user.save();
	return { auToken };
}

async function validateGuest({ token, password, state }) {
	try {
		const decoded = jwt.verify(token, config.backend.secrets.session);
		const user = await User.findById(decoded._id);
		if (!user) throw new ApiError('USER_NOT_FOUND');
		const auth = user.authenticate(decoded.h);
		if (!auth) throw new ApiError('USER_WRONG_PASSWORD');
		if (state === 'delete') {
			return await deleteAccount(user);
		} else {
			return await createAccount(user, password);
		}
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
