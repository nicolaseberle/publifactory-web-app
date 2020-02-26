const { ApiError } = require('../../../config/error');
const Journal = require('../journal.model');
const User = require('../../user/user.model');
const { create: createBilling } = require('../../billing/services');

async function create({ userId, journal }) {
	const user = await User.findById(userId);
	if (!user) throw new ApiError('USER_NOT_FOUND');
	const newJournal = new Journal({
		...journal,
		slug: journal.title
	});
	newJournal.users.push(user._id);
	await newJournal.save();
	await createBilling({
		billing: {
			email: user.email,
			fullName: newJournal.title
		},
		journalId: newJournal._id
	});
	const savedJournal = await newJournal.save();
	return savedJournal;
}

module.exports = create;
