const { Publisher } = require('../../publisher/model');

async function readByTitle(publisherId, invitationReviewerTitle) {
	const invitation = await Publisher.findOne(
		{ _id: publisherId },
		{ invitationReviewers: 'invitationReviewers', _id: false },
		{
			populate: {
				path: 'invitationReviewers',
				match: {
					title: {
						$eq: invitationReviewerTitle
					}
				},
				populate: {
					path: 'requests'
				}
			}
		}
	).exec();
	if (!invitation) throw new Error('Publisher not Found.');
	if (invitation.invitationReviewers.length === 0)
		throw new Error('Invitation Reviewer not Found.');
	return invitation;
}

module.exports = readByTitle;
