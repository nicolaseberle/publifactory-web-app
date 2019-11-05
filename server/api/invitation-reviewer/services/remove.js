const { InvitationReviewer } = require('../model');
const requestDelete = require('../../request/services/remove');

async function remove(invitationReviewerId) {
	const invitation = await InvitationReviewer.findById(invitationReviewerId)
		.populate('requests')
		.exec();
	if (!invitation) throw new Error('Invitation Reviewer not found.');
	const deleteRequests = invitation.requests.map(async request => {
		await requestDelete(request._id);
	});
	await Promise.all(deleteRequests);
	const modified = await InvitationReviewer.deleteOne({ _id: invitation._id });
	if (modified.n !== 1 || modified.ok !== 1)
		throw new Error('Invitation Reviewer not found.');
	return invitation;
}

module.exports = remove;
