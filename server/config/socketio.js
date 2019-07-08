'use strict';

class User {
  constructor (id) {
    this.id = id
    console.log('[socket.io] NEW USER JUST CONNECTED: %s', this.id)
  }

  setArticleId (idArticle) {
    this.idArticle = idArticle
  }
}

const mapUser = {};

/**
 * Main calls from the sockets
 * @param io -> the socket declaration
 */
module.exports = function (io) {
  io.on('connection', (socket) => {
    mapUser[socket.id] = new User(socket.id)

    socket.on('disconnect', () => {
      console.log('[socket.io] AN USER JUST DISCONNECTED: %s', mapUser[socket.id].id)
      delete mapUser[socket.id];
    })

    /**
     * Data contain :
     * - content of the changed block
     * - numBlock
     * - numSubBlock
     * - numSubSubBlock
     */
    socket.on('UPDATE_SECTION', (data) => {
      socket.broadcast.emit(`UPDATE_BLOCK`, data)
    })

    /**
     * Data contain id_article
     */
    socket.on('SET_ARTICLE', (data) => {
      mapUser[socket.id].setArticleId(data.id_article)
      console.log('[socket.io] AN USER WORKS ON ARTICLE %s: %s', data.id_article, mapUser[socket.id].id)
    })
  })
};
