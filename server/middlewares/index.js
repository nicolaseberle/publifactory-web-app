const optionalAuthentication = require('./optional-authentication');
const authentication = require('./authentication');
const requireAdminRole = require('./require-admin-role');

module.exports = {
	optionalAuthentication,
	authentication,
	requireAdminRole
};
