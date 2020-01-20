const { Request } = require("../model");
const sendEmailEditor = require("./send-email-editor");
const { emailEditorTemplate } = require("../../../config/emailing");

async function create({ reviewer, editor, ...request }) {
	const newRequest = new Request({
		reviewer,
		editor,
		...request
	});
	newRequest.history.push({
		status: "pending",
		date: new Date().toUTCString()
	});

	await newRequest.save();
	if (newRequest.editor.email) {
		sendEmailEditor(
			newRequest._id,
			"Copy of your reviewing request",
			emailEditorTemplate.summary(newRequest)
		);
	}
	return newRequest.toObject();
}

module.exports = create;
