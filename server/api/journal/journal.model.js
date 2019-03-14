const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const JournalSchema = new Schema({
  creationDate: { type: Date, default: Date.now },
  title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: String,
    default: 'Pending'
  },
  doi: {
    type: String,
    default: 'No_DOI'
  },
  slug: {
    type: String,
    unique: true,
    slug: 'title',
  },
  color_1: {
    type: String,
    default: '#F2DFA6'
  },
  color_2: {
    type: String,
    default: '#E0CF5C'
  },
  editor: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags:[{
    type: String,
  }]
});

JournalSchema.plugin(mongooseDelete, { deletedAt: true });
JournalSchema.plugin(mongoosePaginate);

/**
 * @class Article
 */
const Journal = mongoose.model('Journal', JournalSchema);

module.exports = Journal;
