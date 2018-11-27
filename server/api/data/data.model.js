const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DataSchema = new Schema({
  creationDate: { type: Date, default: Date.now },
  name :{
    type: String
  },
  header: {
    type: String
  },
  content: {
    type: String
  },
  doi: {
    type: String,
    default: 'No_DOI'
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags:[{
    type: String,
  }]
});

/**
 * @class Data
 */
const Data = mongoose.model('Data', DataSchema);

module.exports = Data;
