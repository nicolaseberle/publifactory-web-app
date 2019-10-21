import ShareDB from 'sharedb/lib/client';
import richText from 'rich-text';

ShareDB.types.register(richText.type);

const url =
	location.protocol === 'https:'
		? 'wss' + '://' + window.location.hostname + '/collaboration'
		: 'ws' + '://' + window.location.hostname + ':4000' + '/collaboration';

/**
 * Wrapper on Reconnecting-Websocket
 */

class wsShareDBClient {
	constructor(userId, articleId) {
		this.userId = userId;
		this.articleId = articleId;
		this.wssdb = new WebSocket(url);
		this.type = richText.type.name;
		this.connection = new ShareDB.Connection(this.wssdb);
	}

	close() {
		this.wssdb.close();
	}

	getConnection() {
		return this.connection;
	}
}

export default wsShareDBClient;
