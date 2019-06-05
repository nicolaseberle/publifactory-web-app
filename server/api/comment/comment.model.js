var mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  creationDate: { type: Date, default: Date.now },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  // TODO Déprécié : utiliser l'_id à partir de l'article
  uuidComment: {
    type: String
  },
  anonymousFlag:{
    type: Boolean,
    default: false
  },
  commentFlag:{
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: true
  },
  reviewRequest: {
    type: String,
    required: true
  },
  scores: {
    voterId:[{
      type: String
    }],
    upvote: {
      type: Number,
      default: 0
    },
    downvote:{
      type: Number,
      default: 0
    }
  },
  childComment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }]
});





CommentSchema.plugin(mongooseDelete, { deletedAt: true });
CommentSchema.plugin(mongoosePaginate);

var autoPopulateComment = function(next) {
  this.populate('childComment');
  next();
};

CommentSchema.
  pre('findOne', autoPopulateComment).
  pre('find', autoPopulateComment);
/**
 * @class Comment
 */

module.exports = mongoose.model('Comment', CommentSchema);
