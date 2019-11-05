const { InvitationReviewer } = require('../model');

async function create(invitationReviewer) {
	const newInvitationReviewer = new InvitationReviewer({
		...invitationReviewer
	});
	await newInvitationReviewer.save();
	return newInvitationReviewer;
}

module.exports = create;
