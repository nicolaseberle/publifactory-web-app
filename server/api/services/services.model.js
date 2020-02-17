'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EvalSchema = new Schema({
  created_at: {
    type: Date
  },
  fields:{
    type: Array,
    required: true
  },
  subfields:{
    type: Array
  },
   evaluationPositive:{
    type: Number,
    required: true
  },
  evaluationNegative:{
    type: Number,
    required: true
  },
  evaluationUnknown:{
    type: Number,
    required: true
  }
})

/**
 * @class Evaluation
 */
const Evaluation = mongoose.model('Evaluation', EvalSchema);

module.exports = Evaluation;
