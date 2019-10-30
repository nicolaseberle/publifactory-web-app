const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
	{
		reviewer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		journal: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		status: {
			type: String,
			default: 'pending',
			enum: {
				values: [
					'pending',
					'sent',
					'read',
					'accepted',
					'reject',
					'outfield',
					'done'
				]
			}
		}
	},
	{ timestamps: true }
);

module.exports.Request = mongoose.model('InvitationReviewer', RequestSchema);
module.exports.RequestSchema = RequestSchema;
