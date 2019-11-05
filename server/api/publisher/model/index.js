const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const PublisherSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		journal: {
			name: { type: String, required: true },
			issn: {
				type: String,
				maxlength: 8,
				minlength: 8,
				unique: true
			},
			editor: {
				name: { type: String, required: true },
				email: { type: String, required: true },
				user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
			}
		},
		invitationReviewers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'InvitationReviewer'
			}
		]
	},
	{ timestamps: true }
);

module.exports.Publisher = mongoose.model('Publisher', PublisherSchema);
module.exports.PublisherSchema = PublisherSchema;
