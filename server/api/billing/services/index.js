const create = require('./create');
const read = require('./read');
const update = require('./update');
const list = require('./list');
const upgradePlan = require('./upgrade-plan');
const stripe = require('./stripe');
const unsubscribe = require('./unsubscribe');
const requestUpgrade = require('./request-upgrade');

module.exports = {
	create,
	read,
	update,
	list,
	upgradePlan,
	unsubscribe,
	requestUpgrade,
	...stripe
};
