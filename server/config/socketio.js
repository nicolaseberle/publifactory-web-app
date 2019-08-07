'use strict';

const history = require('../api/article/history/history.controller');
const User = require('../api/user/user.model');

/**
 * @class SocketUser
 * @description this class is used to stock with generic parameters a list of users.
 * @author Léo Riberon-Piatyszek
 */
class SocketUser {
  constructor (id) {
    this.id = id;
    this.idUser = '';
    this.name = '';
    console.log('[socket.io] NEW USER JUST CONNECTED: %s', this.id)
  }

  setArticleId (idArticle) { this.idArticle = idArticle }

  async setUserId (idUser) {
  	this.idUser = idUser;
  	this.name = await new Promise(async resolve => {
  		const user = await User.findOne({ _id: idUser });
  		resolve(`${user.firstname[0].toUpperCase()}. ${user.lastname.toUpperCase()}`)
		})
  }
}

/**
 *
 * @type {{SocketUser}}
 */
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
		 *	This part is used to retrieve all the users actually connected
		 *  on an article specified in the data parts.
		 */
		socket.on('GET_USERS', data => {
			try {
				let userList = [];
				for (let user in mapUser)
					if (mapUser.hasOwnProperty(user) && data.id_article === mapUser[user].idArticle){
						userList.push(mapUser[user]);

          }
				socket.to(mapUser[socket.id].idArticle).emit('RESULT_USERS', userList);
			} catch (e) {
				console.error(e);
			}
		});

    /**
     * Data contain id_article and id_user
     * We put the user socket in a room to broadcast just only specific users
     * We set the userId and the articleId to the class of the user.
     */
    socket.on('SET_ARTICLE', async data => {
      mapUser[socket.id].setArticleId(data.id_article);
			socket.join(data.id_article);
      await mapUser[socket.id].setUserId(data.id_user);
      console.log('[socket.io] AN USER WORKS ON ARTICLE %s: %s', data.id_article, mapUser[socket.id].id)
    });

    /**
     * Data contain :
     * - content of the changed block
     * - numBlock
     * - numSubBlock
     * - numSubSubBlock
     */
    socket.on('SECTION_EDIT', data => {
      console.log('[socket.io] %s TRANSMIT INFORMATION', mapUser[socket.id].id);
      history.addInstruction(mapUser[socket.id], 'SECTION_EDIT');
      socket.to(mapUser[socket.id].idArticle).emit(`SECTION_UPDATE`, data)
    });

    /**
     * Data contains the events
     * All of this socket calls is used to transmit the update information
     */

    /**
     * This one is used to update the abstract
     */
    socket.on('ABSTRACT_EDIT', data => {
      console.log('[socket.io] %s TRANSMIT ABSTRACT', mapUser[socket.id].id);
      history.addInstruction(mapUser[socket.id], 'ABSTRACT_EDIT');
      socket.to(mapUser[socket.id].idArticle).emit('ABSTRACT_UPDATE', data)
    });

    /**
     * The next "NEW_" are used to insert a new block in other views
     * It responds a "ADD_" socket instruction
     */
    socket.on('NEW_ROW', data => {
      console.log('[socket.io] NEW ROW ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_ROW');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_ROW', data)
    });

    socket.on('NEW_TAG', data => {
      console.log('[socket.io] NEW TAG ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_TAG');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_TAG', data)
    });

    socket.on('NEW_ONE_BLOCK', data => {
      console.log('[socket.io] ONE BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_ONE_BLOCK');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_ONE_BLOCK', data)
    });

    socket.on('NEW_TWO_BLOCK', data => {
      console.log('[socket.io] TWO BLOCKS ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_TWO_BLOCK');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_TWO_BLOCK', data)
    });

    socket.on('NEW_BLOCK_TEXT', data => {
      console.log('[socket.io] NEW TEXT BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_BLOCK_TEXT');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_BLOCK_TEXT', data)
    });

    socket.on('NEW_BLOCK_CHART', data => {
      console.log('[socket.io] NEW CHART BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_BLOCK_CHART');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_BLOCK_CHART', data)
    });

    socket.on('NEW_BLOCK_PICTURE', data => {
      console.log('[socket.io] NEW PICTURE BLOCK ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_BLOCK_PICTURE');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_BLOCK_PICTURE', data)
    });

    socket.on('NEW_COMMENT', data => {
      console.log('[socket.io] NEW COMMENT ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_COMMENT');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_COMMENT', data)
    });

    socket.on('NEW_COLLABORATOR', data => {
      console.log('[socket.io] NEW COLLABORATOR ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_COLLABORATOR');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_COLLABORATOR', data)
    });

    socket.on('NEW_DATA', data => {
      console.log('[socket.io] NEW DATA ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_DATA');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_DATA', data)
    });

    socket.on('NEW_VERSION', data => {
      console.log('[socket.io] NEW VERSION ADDED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'NEW_VERSION');
      socket.to(mapUser[socket.id].idArticle).emit('ADD_VERSION', data)
    });

    /**
     * The next "REMOVE_" are used to delete some blocks / content
     * It responds a "DELETE_" socket instruction
     */
    socket.on('REMOVE_BLOCK', data => {
      console.log('[socket.io] BLOCK REMOVED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'REMOVE_BLOCK');
      socket.to(mapUser[socket.id].idArticle).emit('DELETE_BLOCK', data)
    });

    socket.on('REMOVE_ROW', data => {
      console.log('[socket.io] ROW REMOVED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'REMOVE_ROW');
      socket.to(mapUser[socket.id].idArticle).emit('DELETE_ROW', data)
    });

    socket.on('REMOVE_COLLABORATOR', data => {
      console.log('[socket.io] COLLABORATOR REMOVED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'REMOVE_COLLABORATOR');
      socket.to(mapUser[socket.id].idArticle).emit('DELETE_COLLABORATOR', data)
    });

    socket.on('REMOVE_DATA', data => {
      console.log('[socket.io] DATA REMOVED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'REMOVE_DATA');
      socket.to(mapUser[socket.id].idArticle).emit('DELETE_DATA', data)
    });

    /**
     * The next "UPDATE_" are used to update figures and picture blocks
     * inserted in the article.
     * It responds a "MODIFY_" socket instruction
     */
    socket.on('UPDATE_BLOCK_PICTURE', data => {
      console.log('[socket.io] PICTURE BLOCK UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'UPDATE_BLOCK_PICTURE');
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_BLOCK_PICTURE', data)
    });

    socket.on('UPDATE_TITLE', data => {
      console.log('[socket.io] TITLE UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'UPDATE_TITLE');
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_TITLE', data)
    });

    socket.on('UPDATE_COLLABORATOR', data => {
      console.log('[socket.io] COLLABORATOR ROLES UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'UPDATE_COLLABORATOR');
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_COLLABORATOR', data)
    });

    socket.on('UPDATE_STATUS', data => {
      console.log('[socket.io] STATUS UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'UPDATE_STATUS');
      socket.to(mapUser[socket.id].idArticle).emit('MODIFY_STATUS', data)
    });

    socket.on('UPDATE_VERSION', data => {
      console.log('[socket.io] VERSION UPDATED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'UPDATE_VERSION');
      io.in(mapUser[socket.id].idArticle).emit('MODIFY_VERSION', data)
    });

    /**
     * The next "EXEC_CODE_" are used to update the figures and
     * information about the figure code and graphs.
     * It responds a "LOAD_CODE_" socket instruction.
     * This part is used in the client at ScriptPython & ScriptR
     */
    socket.on('EXEC_CODE_R', data => {
      console.log('[socket.io] R CODE EXECUTED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'EXEC_CODE_R');
      socket.to(mapUser[socket.id].idArticle).emit('LOAD_CODE_R', data)
    });

    socket.on('EXEC_CODE_PYTHON', data => {
      console.log('[socket.io] PYTHON CODE EXECUTED BY %s IN ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'EXEC_CODE_PYTHON');
      socket.to(mapUser[socket.id].idArticle).emit('LOAD_CODE_PYTHON', data)
    });

    socket.on('EXEC_PDF', () => {
      console.log('[socket.io] PDF DOWNLOADED BY %s OF ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      history.addInstruction(mapUser[socket.id], 'LOAD_PDF');
    });

		/**
		 * The next "QUILL_NEW_" are used to update the cursor positions
		 * for every author in the view on the LightEditor.
		 * It responds a "QUILL_EXEC_" socket instruction.
		 * This part is used in the client at QuillEditor/index.vue.
		 * This part doesn't need to add these information on the history mongo's table :
		 * We already have update information in the UPDATE_ part.
		 */
		socket.on('QUILL_NEW_USER', data => {
			console.log('[socket.io] NEW QUILL TEXT UPDATE BY %s OF ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
			socket.to(mapUser[socket.id].idArticle).emit('QUILL_EXEC_USER', data);
		});

		socket.on('QUILL_NEW_TEXT', data => {
      console.log('[socket.io] NEW QUILL TEXT UPDATE BY %s OF ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      socket.to(mapUser[socket.id].idArticle).emit('QUILL_EXEC_TEXT', data);
    });

		socket.on('QUILL_NEW_SELECT', data => {
      console.log('[socket.io] NEW QUILL SELECTION BY %s OF ARTICLE %s', mapUser[socket.id].id, mapUser[socket.id].idArticle);
      socket.to(mapUser[socket.id].idArticle).emit('QUILL_EXEC_SELECT', data);
    });
	})
};
