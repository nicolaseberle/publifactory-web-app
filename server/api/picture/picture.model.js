'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var PictureSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  legend: {
    type: String,
    default: null
  },
  license: {
    type: String,
    default: 'CC (https://creativecommons.org/share-your-work/licensing-types-examples/)'
  }
});

/**
 * @class Comment
 */

module.exports = mongoose.model('Picture', PictureSchema);
