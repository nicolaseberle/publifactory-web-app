const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FigureSchema = new Schema({
  data :{
    x: {type:String},
    y: {type:String},
    type: {type:String},
    orientation: {type:String}
  },
  layout:{
    title:{String},
    showlegend: {Boolean}
  },
  option:{
    type: {String}
  },
  script: {
    language: {
      type: String,
      default: "Light"
    },
    content: {
      type: String,
      default: null
    }
  }
});

/**
 * @class Figure
 */
const Figure = mongoose.model('Figure', FigureSchema);

module.exports = Figure;
