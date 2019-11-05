const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
	{
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
			},
			emailVerified: {
				type: Boolean,
				required: true
			}
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

module.exports.Request = mongoose.model('Request', RequestSchema);
module.exports.RequestSchema = RequestSchema;
