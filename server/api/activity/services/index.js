const create = require('./service');
const list = require('./list');
const occurenceByDate = require('../services/occurencebydate');
const totalRequest = require('../services/totalRequest');

module.exports = {
	create,
	list,
	occurenceByDate,
	totalRequest
};
