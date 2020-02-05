const { Request } = require('../model');
const { Billing } = require('../../billing/model');
const {
	emailEditorTemplate,
	emailEditorApproval
} = require('../../../config/emailing');
const serviceRole = require('../../roles/services');
const { ApiError } = require('../../../config/error');
const Email = require('../../email/email.controller');

async function create({ reviewer, editor, ...request }, authId, billingId) {
	const billing = await Billing.findById(billingId);
	if (!billing) throw new ApiError('BILLING_NOT_FOUND');
	const email = new Email(editor.email);

	const newRequest = new Request({
		reviewer,
		editor,
		...request
	});
	billing.requests.push(newRequest._id);
	const userRole = await serviceRole.journalGetRole({
		journalId: editor.journal,
		userId: authId
	});
	await newRequest.populate('editor.journal').execPopulate();
	if (!userRole) {
		const editorRole = await serviceRole.journalGetRole({
			journalId: editor.journal,
			right: 'editor'
		});
		newRequest.history.push({
			status: 'approval',
			date: new Date().toUTCString()
		});
		const emailEditor = new Email(editorRole.id_user.email);
		emailEditor.sendEmail({
			subject: `A potential associate editor of ${newRequest.editor.journal.title}'s Journal`,
			html: emailEditorApproval(newRequest)
		});
	} else {
		newRequest.history.push({
			status: 'pending',
			data: new Date().toUTCString()
		});
	}
	await newRequest.save();
	await billing.save();
	if (newRequest.editor.email) {
		email.sendEmail({
			subject: 'Copy of your reviewing request',
			html: emailEditorTemplate.summary(newRequest)
		});
	}
	return newRequest.toObject();
}

module.exports = create;
