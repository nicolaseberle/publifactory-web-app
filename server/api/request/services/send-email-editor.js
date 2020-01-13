const { Request } = require("../model/index");
const Email = require("../../email/email.controller");

async function sendEmailEditor(requestId, subject, template) {
	const request = await Request.findById(requestId);
	if (!request) throw new Error("REQUEST_NOT_FOUND");
	const email = new Email(request.editor.email);
	email.sendEmailRequestEditor(subject, template);
}

module.exports = sendEmailEditor;
