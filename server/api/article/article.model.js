const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  content: {
    type: String
  },
  arr_content:[{
    title:String,
    content:String
  }],
  published: {
    type: Boolean,
    required: true,
    default: false,
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
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  reviewers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]
});

ArticleSchema.plugin(mongooseDelete, { deletedAt: true });
ArticleSchema.plugin(mongoosePaginate);

/**
 * @class Article
 */
const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
