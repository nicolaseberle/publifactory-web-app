const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const InvitationReviewerSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			required: true,
			unique: true,
			slug: 'title'
		},
		abstract: {
			type: String,
			required: true
		},
		requests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Request'
			}
		],
		deadline: Date
	},
	{ timestamps: true }
);

module.exports.InvitationReviewer = mongoose.model(
	'InvitationReviewer',
	InvitationReviewerSchema
);
module.exports.InvitationReviewerSchema = InvitationReviewerSchema;
