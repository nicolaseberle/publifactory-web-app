const mongoose = require('mongoose');

const enumStatus = [
	'approval', // user is not in journal
	'pending', // all good need to be sent
	'bademail',
	'sent', // email sent to reviewer
	'remind', // another mail sent to reviewer
	'read', // reviewer has read the mail
	'accepted',
	'rejected',
	'outfield',
	'unsubscribed',
	'done', // request flow done
	'removed' // request deleted
];

const RequestSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		abstract: {
			type: String,
			required: true
		},
		deadline: {
			type: Date,
			required: true
		},
		object: {
			type: String
		},
		content: {
			type: String
		},
		remind: {
			type: String
		},
		remindMax: { type: Number, default: 3 },
		remindCount: { type: Number, default: 0 },
		reviewer: {
			semanticScholarId: {
				type: String,
				required: true
			},
			email: {
				type: String
			},
			name: {
				type: String
			}
		},
		user: {
			// creator of the request
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		journal: {
			// which journal the request is on
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Journal'
		},
		history: {
			type: Array,
			date: Date,
			status: {
				type: String,
				default: 'pending',
				enum: {
					values: enumStatus
				}
			}
		},
		billing: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Billing'
		}
	},
	{ timestamps: true }
);

module.exports.Request = mongoose.model('Request', RequestSchema);
module.exports.RequestSchema = RequestSchema;
module.exports.enumStatus = enumStatus;
