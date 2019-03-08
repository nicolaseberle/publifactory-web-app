/**
 * Broadcast updates to client when the model changes
 */

'use strict'

var comment = require('./comment.model')

exports.register = function (socket) {
  comment.schema.post('save', function (doc) {
    onSave(socket, doc)
  })
  comment.schema.post('remove', function (doc) {
    onRemove(socket, doc)
  })
}

function onSave (socket, doc, cb) {
  socket.emit('comment:save', doc)
}

function onRemove (socket, doc, cb) {
  socket.emit('comment:remove', doc)
}
