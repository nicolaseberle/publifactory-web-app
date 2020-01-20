const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
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
				ref: 'Review',
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

ReviewSchema.plugin(mongooseDelete, { deletedAt: true });
ReviewSchema.plugin(mongoosePaginate);

const autoPopulateChildReview = function(next) {
	this.populate('child child.userId');
	next();
};
const autoPopulateUser = function(next) {
	this.populate('userId');
	next();
};

ReviewSchema.pre('findById', autoPopulateChildReview)
	.pre('find', autoPopulateChildReview)
	.pre('findById', autoPopulateUser)
	.pre('find', autoPopulateUser);

mongoose.set('debug', true);
module.exports = mongoose.model('Review', ReviewSchema);
