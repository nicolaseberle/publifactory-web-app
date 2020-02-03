const { Billing } = require('../model');

async function create({ userId = undefined, journalId = undefined }) {
	console.log(userId, journalId);
	// await newBilling.save();
	// return newBilling.toObject();
}

module.exports = create;
