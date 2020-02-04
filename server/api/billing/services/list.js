const User = require('../../user/user.model');
const Journal = require('../../journal/journal.model');
const { ApiError } = require('../../../config/error');
const pagination = require('../../../config/pagination');

async function findJournalsByUser(userId, page, count) {
	const pipeline = [];
	const match = {
		$match: {
			users: { $in: [userId] }
		}
	};
	const projection = {
		$project: {
			_id: false,
			title: '$title',
			doi: '$doi',
			billing: '$billing'
		}
	};
	pipeline.push(match, projection, ...pagination(page, count));
	const journals = await Journal.populate(await Journal.aggregate(pipeline), {
		path: 'billing',
		populate: { path: 'requests' }
	});
	return journals;
}

async function list({ userId, page = 1, count = 5 }) {
	const user = await User.findById(userId).populate('billing');
	if (!user) throw new ApiError('USER_NOT_FOUND');
	const billings = await findJournalsByUser(userId, page, count);
	return { ...user.billing.toObject(), journalBillings: billings, page, count };
}

module.exports = list;
