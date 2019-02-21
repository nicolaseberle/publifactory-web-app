const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  creationDate: { type: Date, default: Date.now },
  title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  arr_content:[{
    title:String,
    content:String,
    path_figure: String,//add the path of script object
    display: {
      type: Boolean,
      default: true
    },
    block:[[{
      type:{
        type: String,
        default: 'text'
      },
      content:{
        type: String,
        default: 'Type your text'
      },
      uuid: {
        type: String,
        default: ''
      },
      nbEdit:{
        type: Number,
        default: 0
      }
    }]]
  }],
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: String,
    default: 'draft'
  },
  doi: {
    type: String,
    default: 'No_DOI'
  },
  slug: {
    type: String,
    unique: true,
    slug: 'title'
  },
  arr_data: [{
    type: Schema.Types.ObjectId,
    ref: 'Data'
  }],
  authors: [{
    rank: {type:Number},
    role: {type:String},
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }}
  ],
  reviewers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  tags:[{
    type: String
  }],
  nbComments: {
      type: Number,
      default: 0
  },
  nbReviews: {
        type: Number,
        default: 0
  }
});

ArticleSchema.plugin(mongooseDelete, { deletedAt: true });
ArticleSchema.plugin(mongoosePaginate);

/**
 * @class Article
 */
const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
