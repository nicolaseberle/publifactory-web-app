const create = require("./create");
const update = require("./update");
const read = require("./read");
const remove = require("./remove");
const list = require("./list");
const myRequest = require("./myRequest");
const reviewerResponse = require("./reviewer-response");
const reviewerRead = require("./reviewer-read");
const logo = require("./logo");
const remind = require("./remind");
const totalRequest = require('./totalRequest');


module.exports = {
	create,
	update,
	read,
	remove,
	list,
	myRequest,
	reviewerResponse,
	reviewerRead,
	logo,
	remind,
	totalRequest
};
