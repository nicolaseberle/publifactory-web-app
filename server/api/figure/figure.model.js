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
    title:{
      type:String,
      required: true
    },
    showlegend: {type:Boolean}
  },
  option:{
    type: {String}
  },
  script: {
    language: {
      type: String,
      default: "Light"
    },
    content: [{
      title: {
        type: String,
        default: null
      },
      name: {
        type: String,
        default: null
      },
      content: {
        type: String,
        default: null
      }
    }]
  },
  infos: {
    legend: {
      type: String,
      default: null
    },
    source: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    uuid_figure: {
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
