const mongoose = require('mongoose')

const mongoosePaginate = require('mongoose-paginate')
const mongooseDelete = require('mongoose-delete')

const Schema = mongoose.Schema

const GlobalReviewSchema = new Schema(
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
			enum: ['validate', 'rejected'],
			required: true
		},
		innovation: {
			type: Number,
			min: 0,
			max: 5
		},
		reproducibility: {
			type: Number,
			min: 0,
			max: 5
    },
    writting: {
			type: Number,
			min: 0,
			max: 5
    },
    rigor: {
			type: Number,
			min: 0,
			max: 5
    },
    stats: {
			type: Number,
			min: 0,
			max: 5
    },
    quality: {
      type: Number,
      min: 0,
      max: 5
    }
	},
	// createdAt, updateAt
	{ timestamps: true }
);

GlobalReviewSchema.plugin(mongooseDelete, { deletedAt: true });
GlobalReviewSchema.plugin(mongoosePaginate);


mongoose.set('debug', true)
module.exports = mongoose.model('GlobalReview', GlobalReviewSchema)
