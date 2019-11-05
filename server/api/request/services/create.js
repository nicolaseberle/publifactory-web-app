const { Publisher } = require('../../publisher/model');
const { InvitationReviewer } = require('../../invitation-reviewer/model');
const { Request } = require('../model');
const createPublisher = require('../../publisher/services/create');
const createInvitationReviewer = require('../../invitation-reviewer/services/create');

async function getInvitation(publisherName, invitationReviewerTitle) {
	const invitationExist = await Publisher.findOne(
		{
			name: publisherName
		},
		{ invitationReviewers: 'invitationReviewers', _id: false },
		{
			populate: {
				path: 'invitationReviewers',
				match: {
					title: {
						$eq: invitationReviewerTitle
					}
				}
			}
		}
	);
	return invitationExist.invitationReviewers.length !== 0
		? invitationExist.invitationReviewers[0]
		: undefined;
}

async function requestExist(invitationReviewerId, requestSemanticScholarId) {
	const requestExist = await InvitationReviewer.findOne(
		{
			_id: invitationReviewerId
		},
		{ requests: 'requests', _id: false },
		{
			populate: {
				path: 'requests',
				match: {
					'reviewer.semanticScholarId': {
						$eq: requestSemanticScholarId
					}
				}
			}
		}
	).exec();
	return requestExist.requests.length !== 0;
}

async function create(data) {
	let publisher = await Publisher.findOne({ name: data.publisher.name });
	let invitationReviewer;
	if (!publisher) {
		// if no publisher create publisher & invitation reviewer
		publisher = await createPublisher(data.publisher);
		invitationReviewer = await createInvitationReviewer(
			data.invitationReviewer
		);
		publisher.invitationReviewers.push(invitationReviewer);
		await publisher.save();
	} else {
		// publisher found - find or create invitation reviewer
		const invit = await getInvitation(
			data.publisher.name,
			data.invitationReviewer.title
		);
		if (invit) {
			invitationReviewer = invit;
		} else {
			invitationReviewer = await createInvitationReviewer(
				data.invitationReviewer
			);
			publisher.invitationReviewers.push(invitationReviewer);
			await publisher.save();
			await invitationReviewer.save();
		}
	}

	if (
		await requestExist(invitationReviewer._id, data.reviewer.semanticScholarId)
	) {
		throw new Error('Duplicate request in Invitation Reviewer');
	}

	const newRequest = new Request({
		reviewer: data.reviewer
	});
	invitationReviewer.requests.push(newRequest);

	await invitationReviewer.save();
	await newRequest.save();
	await publisher.save();
	return {
		request: newRequest,
		invitationReviewerId: invitationReviewer._id,
		publisherId: publisher._id
	};
}

module.exports = create;
