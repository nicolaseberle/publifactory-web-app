const User = require('../user.model');
const roleExist = require('./role-exist');

async function addRole(userId, role) {
	if (!roleExist(role)) throw { code: 403, message: 'USER_BAD_ROLE' };
	const user = await User.findByIdAndUpdate(
		userId,
		{
			$addToSet: { roles: role }
		},
		{ new: true }
	);
	return user;
}

module.exports = addRole;
