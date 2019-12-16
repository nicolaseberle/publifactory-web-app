const { Request } = require("../model");
const sendEmailReviewer = require("./send-email-reviewer");

async function remind(requestId) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error("REQUEST_NOT_FOUND");
	request.remindCount += 1;
	sendEmailReviewer(requestId);
	request.history.push({
		status: "remind",
		date: new Date().toUTCString()
	});
	await request.save();
	return request;
}

module.exports = remind;
