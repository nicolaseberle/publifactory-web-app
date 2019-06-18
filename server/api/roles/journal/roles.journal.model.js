'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Role Article Schema
 */
const RolesJournalSchema = new Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  id_journal: {
    type: Schema.Types.ObjectId,
    ref: 'Journal'
  },
  right: {
    type: String,
    default: 'user'
  }
})

/**
 *
 * @type {*|*[]|(function(*, *): (null|*))|(function(*, *): *)|(function(*, *): *)|(function(*, *): *)|(function(*, *=, *=): *)|(function(*=, *, *): boolean)|(function(*, *=, *=): *)|{preTransformNode}|string}
 */
const RolesJournal = mongoose.model('RoleJournal', RolesJournalSchema);

module.exports = RolesJournal;
