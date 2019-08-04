'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');


const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id_article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  instruction: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true,
    default: new Date()
  },
  priority: {
    type: Number,
    default: 0
  }
});

HistorySchema.plugin(mongoosePaginate);

const History = mongoose.model('History', HistorySchema);

module.exports = History;
