const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const InvitationReviewerSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		slug: {
			type: String,
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

InvitationReviewerSchema.index(
	{ 'requests.semanticScholarId': 1 },
	{ unique: true }
);
module.exports.InvitationReviewer = mongoose.model(
	'InvitationReviewer',
	InvitationReviewerSchema
);
module.exports.InvitationReviewerSchema = InvitationReviewerSchema;
