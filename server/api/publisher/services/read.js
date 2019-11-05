const { Publisher } = require('../model');

async function read(publisherId) {
	const publisher = await Publisher.findById(publisherId)
		.populate({
			path: 'invitationReviewers',
			populate: {
				path: 'requests'
			}
		})
		.exec();
	return publisher;
}

module.exports = read;
