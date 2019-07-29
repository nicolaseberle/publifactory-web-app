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
  journal: {
    type: Schema.Types.ObjectId,
    ref: 'Journal'
  },
  content: {
    type: String
  },
  arr_content:[{
    title:String,
    content:String,//deprecated
    path_figure: String,//deprecated // migrate url path for shiny
    display: {
      type: Boolean,
      default: true
    },//deprecated
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
        default: 0//need it to refresh figures after editing
      }
    }]]
  }],
  published: {
    type: Boolean,
    required: true,
    default: false
  },//deprecated
  status: {
    type: String,
    required: true,
    default: 'draft'
  },
  doi: {
    type: String,
    default: 'No_DOI'
  },
  sharingLink :{
    type: String,
    default: '/'
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
  associate_editor:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  invitation:[{
    type: Schema.Types.ObjectId,
    ref: 'Invitation'
  }],
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
  },
  version: [{
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    abstract: {
      type: String,
      required: true
    },
    arr_content:[{
      title:String,
      content:String,//deprecated
      path_figure: String,//deprecated // migrate url path for shiny
      display: {
        type: Boolean,
        default: true
      },//deprecated
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
          default: 0//need it to refresh figures after editing
        }
      }]]
    }],
    date: {
      type: String,
      required: true,
      default: new Date()
    }
  }]
});

ArticleSchema.plugin(mongooseDelete, { deletedAt: true });
ArticleSchema.plugin(mongoosePaginate);

/**
 * @class Article
 */
const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
