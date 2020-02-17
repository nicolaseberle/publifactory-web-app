const create = require('./create');
const read = require('./read');
const update = require('./update');
const list = require('./list');
const upgradePlan = require('./upgrade-plan');
const stripe = require('./stripe');
const unsubscribe = require('./unsubscribe');

module.exports = {
	create,
	read,
	update,
	list,
	upgradePlan,
	unsubscribe,
	...stripe
};
