const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DataSchema = new Schema({
  creationDate: { type: Date, default: Date.now },
  name :{
    type: String
  },
  header: [{
    type: String
  }],
  content: [{}],
  doi: {
    type: String,
    default: 'No_DOI'
  },
  id_article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  tags:[{
    type: String,
  }]
});

/**
 * @class Data
 */
const Data = mongoose.model('Data', DataSchema);

module.exports = Data;
