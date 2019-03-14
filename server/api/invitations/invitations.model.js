'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var InvitationSchema = new Schema({
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  link: {
    type: String,
    default: 'None'
  },
  recieptEmail:{
    type: String,
    default: 'None'
  },
  senderId: {
    type: String,
    default: 'None'
  },
  senderMsg: {
    type: String,
    default: 'None'
  },
  senderName: {
    type: String,
    default: 'None'
  },
  senderLastname: {
    type: String,
    default: 'None'
  },
  senderFirstname: {
    type: String,
    default: 'None'
  }
})

/**
 * @class Invitation
 */
const Invitation = mongoose.model('Invitation', InvitationSchema);

module.exports = Invitation;
