import ShareDB from 'sharedb/lib/client';
import richText from 'rich-text';
ShareDB.types.register(richText.type);

const url =
	location.protocol === 'https:'
		? 'wss' + '://' + window.location.hostname + ':4000' + '/collaboration'
		: 'ws' + '://' + window.location.hostname + ':4000' + '/collaboration';

console.log('WEBSOCKET ON URL=>', url);
// const url = 'ws://localhost:4000/collaboration';
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

	getConnection() {
		return this.connection;
	}
}

export default rwsClient;
