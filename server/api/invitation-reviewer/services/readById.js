const { InvitationReviewer } = require('../model');

async function readById(invitationReviewerId) {
	const invitationReviewer = await InvitationReviewer.findById(
		invitationReviewerId
	)
		.populate('requests')
		.exec();
	if (!invitationReviewer) throw new Error('Invitation reviewer not found');
	return invitationReviewer;
}

module.exports = readById;
