const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const mongooseDelete = require('mongoose-delete')

const Schema = mongoose.Schema

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
    slug: 'title'
  },
  color_1: {
    type: String,
    default: '#F2DFA6'
  },
  color_2: {
    type: String,
    default: '#E0CF5C'
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tags: [
    {
      type: String
    }
  ],
  content: [
    {
      published: {
        type: Boolean,
        default: false
      },
      reference: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        default: null
      }
    }
  ],
  billing: {
    type: Schema.Types.ObjectId,
    ref: 'Billing'
  }
})

JournalSchema.plugin(mongooseDelete, { deletedAt: true })
JournalSchema.plugin(mongoosePaginate)

/**
 * @class Article
 */
const Journal = mongoose.model('Journal', JournalSchema)

module.exports = Journal
