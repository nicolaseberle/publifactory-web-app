import ReconnectingWebScoket from 'reconnecting-websocket';
import ShareDB from 'sharedb/lib/client';
import richText from 'rich-text';

ShareDB.types.register(richText.type);

// TODO real url
const url = 'ws://localhost:4000/collaboration';

const actions = {
	SECTION_EDIT: 'SECTION_EDIT',
	SECTION_UPDATE: 'SECTION_UPDATE'
};

/**
 * Wrapper on Reconnecting-Websocket
 */
class rwsClient {
	constructor(userId, articleId) {
		// super()
		this.userId = userId;
		this.articleId = articleId;
		this.rws = new ReconnectingWebScoket(url);
		this.type = richText.type.name;
		this.rws.addEventListener('open', () => console.log('connected'));

		// this.rws.addEventListener('error', err => console.warn('ERROR', err));

		this.rws.addEventListener('message', packet => {
			console.log('MESSAGE', JSON.parse(packet.data));
			// const { event, ...rest } = JSON.parse(packet.data);
			// if (!event || !actions[event]) return;
			// this.emit([actions[event]], rest);
		});

		this.connection = new ShareDB.Connection(this.rws);
		// this.connection.bindToSocket(this.rws);
	}

	getDoc(collection, id) {
		console.log(id);
		const doc = this.connection.get(collection, `${this.articleId}${id}`);
		if (doc.type === null) {
			console.log('CREATING DOC');
			doc.create([{ insert: '' }], this.rws.type);
		}
		return doc;
	}
}

// util.inherits(rwsClient, EventEmitter);
export default rwsClient;
