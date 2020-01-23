const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const PartialReviewSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		anonymous: {
			type: Boolean,
			default: false
		},
		content: {
			type: String,
			required: true
		},
		type: {
			type: String,
			enum: [
				'no-revision',
				'minor-revision',
				'major-revision',
				'rejection',
				'resolve',
				'comment'
			],
			required: true,
			default: 'comment'
		},
		child: [
			{
				type: Schema.Types.ObjectId,
				ref: 'PartialReview',
				default: []
			}
		],
		scores: {
			voterId: [
				{
					type: String
				}
			],
			upvote: {
				type: Number,
				default: 0
			},
			downvote: {
				type: Number,
				default: 0
			}
		}
	},
	// createdAt, updateAt
	{ timestamps: true }
);

PartialReviewSchema.plugin(mongooseDelete, { deletedAt: true });
PartialReviewSchema.plugin(mongoosePaginate);

const autoPopulateChildPartialReview = function(next) {
	this.populate('child child.userId');
	next();
};
const autoPopulateUser = function(next) {
	this.populate('userId');
	next();
};

PartialReviewSchema.pre('findById', autoPopulateChildPartialReview)
	.pre('find', autoPopulateChildPartialReview)
	.pre('findById', autoPopulateUser)
	.pre('find', autoPopulateUser);

module.exports = mongoose.model('PartialReview', PartialReviewSchema);
