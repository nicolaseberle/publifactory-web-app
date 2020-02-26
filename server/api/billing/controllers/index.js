const read = require('./read');
const update = require('./update');
const create = require('./create');
const remove = require('./remove');
const list = require('./list');
const publicKey = require('./public-key');
const upgradePlan = require('./upgrade-plan');
const unsubscribe = require('./unsubscribe');
const requestUpgrade = require('./request-upgrade');

module.exports = {
	read,
	update,
	create,
	remove,
	list,
	publicKey,
	upgradePlan,
	unsubscribe,
	requestUpgrade
};
