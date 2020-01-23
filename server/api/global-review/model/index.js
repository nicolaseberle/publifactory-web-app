const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const scoreConfig = {
	type: Number,
	min: 0,
	max: 5
};

const GlobalReviewSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		anonymous: {
			type: Boolean,
			default: false
		},
		contentForAuthor: {
			type: String,
			required: true
		},
		contentForEditor: {
			type: String,
			required: true
		},
		type: {
			type: String,
			enum: ['validate', 'reject'],
			required: true
		},
		scores: {
			innovation: scoreConfig,
			reproducibility: scoreConfig,
			writting: scoreConfig,
			rigor: scoreConfig,
			stats: scoreConfig,
			quality: scoreConfig
		}
	},
	// createdAt, updateAt
	{ timestamps: true }
);

GlobalReviewSchema.plugin(mongooseDelete, { deletedAt: true });
GlobalReviewSchema.plugin(mongoosePaginate);

mongoose.set('debug', true);
module.exports = mongoose.model('GlobalReview', GlobalReviewSchema);
