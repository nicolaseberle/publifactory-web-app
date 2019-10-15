const ShareDB = require('sharedb');
const richText = require('rich-text');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

if (process.env.NODE_ENV === 'development') {
	ShareDB.logger.setMethods({
		info: _ => console.log('[SHDB-INFO] ', arguments || _),
		warn: _ => console.log('[SHDB-WARN] ', arguments || _),
		error: _ => console.log('[SHDB-ERR] ', arguments || _)
	});
}

const options = {
	db: ShareDB.MemoryDB(),
	pubsub: ShareDB.MemoryPubSub()
};

ShareDB.types.register(richText.type);

class shareDB {
	constructor() {
		this.shareInstance = new ShareDB();
		this.connection = this.shareInstance.connect();
		this.type = richText.type.name;

		var doc = this.connection.get('toto', 'test');
		doc.fetch(function(err) {
			if (err) throw err;
			if (doc.type === null) {
				doc.create([{ insert: 'Hi!' }], 'rich-text', err => console.log(err));
				return;
			}
		});
	}

	connect() {
		this.shareInstance.connect();
	}

	listen(socket) {
		const stream = new WebSocketJSONStream(socket);
		this.shareInstance.listen(stream);
		this.shareInstance.use('connect', (context, err) => console.log('###connect', err));
		this.shareInstance.use('op', (ctx, r) => console.log('SHARE::DB::SUBMIT', r));
		this.shareInstance.use('submit', (ctx, r) => console.log('SHARE::DB::SUBMIT', r));
		this.shareInstance.use('commit', (ctx, r) => console.log('SHARE::DB::COMMIT', r));
	}
}

module.exports = shareDB;
