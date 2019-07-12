'use strict';

class SocketUser {
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
  /**
   * @function This function permit to manage the connections.
   * @param socket -> Contain the client informations
   */
  io.on('connection', (socket) => {
    mapUser[socket.id] = new SocketUser(socket.id);

    console.log('[socket.io] New SocketUser Map :');
    console.log(mapUser);
    socket.on('disconnect', () => {
      console.log('[socket.io] AN USER JUST DISCONNECTED: %s', mapUser[socket.id].id);
      delete mapUser[socket.id];
    });

    /**
     * Data contain id_article
     * We put the user socket in a room to broadcast just only specific users
     */
    socket.on('SET_ARTICLE', (data) => {
      mapUser[socket.id].setArticleId(data.id_article);
      socket.join(data.id_article);
      console.log('[socket.io] AN USER WORKS ON ARTICLE %s: %s', data.id_article, mapUser[socket.id].id)
    });

    /**
     * Data contain :
     * - content of the changed block
     * - numBlock
     * - numSubBlock
     * - numSubSubBlock
     */
    socket.on('SECTION_EDIT', (data) => {
      console.log('[socket.io] %s TRANSMIT INFORMATION', mapUser[socket.id].id);
      socket.to(mapUser[socket.id].idArticle).emit(`SECTION_UPDATE`, data)
    });

    /**
     * Data contains the events
     * All of this socket calls is used to transmit the update information
     */

    /**
     * This one is used to update the abstract
     */
    socket.on('ABSTRACT_EDIT', (data) => {
      console.log('[socket.io] %s TRANSMIT ABSTRACT', mapUser[socket.id].id)
      socket.to(mapUser[socket.id].idArticle).emit('ABSTRACT_UPDATE', data)
    });

    /**
     * The next "NEW_" are used to insert a new block in other views
     * It responds a "ADD_" socket instruction
     */
    socket.on('NEW_ROW', data => {
      console.log('[socket.io] NEW ROW ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_ROW', data)
    });

    socket.on('NEW_TAG', data => {
      console.log('[socket.io] NEW TAG ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_TAG', data)
    });

    socket.on('NEW_ONE_BLOCK', data => {
      console.log('[socket.io] ONE BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_ONE_BLOCK', data)
    });

    socket.on('NEW_TWO_BLOCK', data => {
      console.log('[socket.io] TWO BLOCKS ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_TWO_BLOCK', data)
    });

    socket.on('NEW_BLOCK_TEXT', data => {
      console.log('[socket.io] NEW TEXT BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_BLOCK_TEXT', data)
    });

    socket.on('NEW_BLOCK_CHART', data => {
      console.log('[socket.io] NEW CHART BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_BLOCK_CHART', data)
    });

    socket.on('NEW_BLOCK_PICTURE', data => {
      console.log('[socket.io] NEW PICTURE BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_BLOCK_PICTURE', data)
    });

    socket.on('NEW_COMMENT', data => {
      console.log('[socket.io] NEW COMMENT ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_COMMENT', data)
    });

    socket.on('NEW_COLLABORATOR', data => {
      console.log('[socket.io] NEW COLLABORATOR ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('ADD_COLLABORATOR', data)
    });

    /**
     * The next "REMOVE_" are used to delete some blocks / content
     * It responds a "DELETE_" socket instruction
     */
    socket.on('REMOVE_BLOCK', data => {
      console.log('[socket.io] BLOCK REMOVED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('DELETE_BLOCK', data)
    });

    socket.on('REMOVE_ROW', data => {
      console.log('[socket.io] ROW REMOVED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('DELETE_ROW', data)
    });

    /**
     * The next "UPDATE_" are used to update figures and picture blocks
     * inserted in the article.
     * It responds a "MODIFY_" socket instruction
     */
    socket.on('UPDATE_BLOCK_PICTURE', data => {
      console.log('[socket.io] PICTURE BLOCK UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_BLOCK_PICTURE', data)
    });

    socket.on('UPDATE_TITLE', data => {
      console.log('[socket.io] TITLE UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_TITLE', data)
    });

    socket.on('UPDATE_COLLABORATOR', data => {
      console.log('[socket.io] COLLABORATOR ROLES UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_COLLABORATOR', data)
    });

    socket.on('UPDATE_STATUS', data => {
      console.log('[socket.io] STATUS UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_STATUS', data)
    });

    /**
     * The next "EXEC_CODE_" are used to update the figures and
     * information about the figure code and graphs.
     * It responds a "LOAD_CODE_" socket instruction.
     * This part is used in the client at ScriptPython & ScriptR
     */
    socket.on('EXEC_CODE_R', data => {
      console.log('[socket.io] R CODE EXECUTED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('LOAD_CODE_R', data)
    });

    socket.on('EXEC_CODE_PYTHON', data => {
      console.log('[socket.io] PYTHON CODE EXECUTED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle)
      socket.to(mapUser[socket.id].idArticle).emit('LOAD_CODE_PYTHON', data)
    });
  })
};
