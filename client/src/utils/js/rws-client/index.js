// import WebSocket from 'ws';
import ShareDB from 'sharedb/lib/client';
import richText from 'rich-text';
import uuidv4 from 'uuid/v4';
ShareDB.types.register(richText.type);

// TODO real url
const url = 'ws://localhost:4000/collaboration';

/**
 * Wrapper on Reconnecting-Websocket
 */
class rwsClient {
	constructor(userId, articleId) {
		this.userId = userId;
		this.articleId = articleId;
		this.rws = new WebSocket(url);
		this.type = richText.type.name;
		this.connection = new ShareDB.Connection(this.rws);
	}

	getCo() {
		return this.connection;
	}
}

export default rwsClient;
