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
	const lists = await findJournalsByUser(userId, page, count);
	const journals = await Promise.all(
		lists.map(async journal => {
			if (journal.billing) {
				return {
					...journal,
					billing: {
						...journal.billing.toObject(),
						subscription: await journal.billing.subscription
					}
				};
			}
			return journal;
		})
	);
	if(user.billing){
		return {
			...user.profile,
			billing: {
				...user.billing.toObject(),
				subscription: await user.billing.subscription
			},
			journals,
			page,
			count
		};
	} else {
		return {
			...user.profile,
			billing: null,
			journals,
			page,
			count
		};
	}

}

module.exports = list;
