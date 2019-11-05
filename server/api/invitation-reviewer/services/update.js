const { InvitationReviewer } = require('../model');

async function update(invitationReviewerId, invitationReviewer) {
	const updatedInvitationReviewer = await InvitationReviewer.findByIdAndUpdate(
		{
			_id: invitationReviewerId
		},
		{
			$set: invitationReviewer
		},
		{ runValidators: true, new: true }
	);
	if (!updatedInvitationReviewer)
		throw new Error('Invitation reviewer not found.');
	return updatedInvitationReviewer;
}

module.exports = update;
