const ShareDB = require('sharedb');
const richText = require('rich-text');
// const DuplexStream = require('./duplex-stream');
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
		this.shareInstance = new ShareDB(options);
		this.connection = this.shareInstance.connect();
		this.type = richText.type.name;
		// this.duplex = new DuplexStream();
		// this.shareInstance.listen(this.duplex);
		// this.stream = new WebSocketJSONStream(ws);
		// this.shareInstance.listen(this.stream);
	}

	connect() {
		this.shareInstance.connect();
	}

	listen(socket) {
		console.log('SHARE::DB::LISTEN::SOCKET');
		const stream = new WebSocketJSONStream(socket);
		this.shareInstance.listen(stream);
		this.shareInstance.use('connect', (context, err) => console.log('###connect', err));
		this.shareInstance.use('op', (ctx, r) => console.log('###op', r));
		this.shareInstance.use('submit', (ctx, r) => console.log('"##sub', r));
	}

	getDoc(docId) {
		const doc = this.connection.get('quilleditor', docId);
		if (doc.type === null) {
			doc.create({}, this.type, err => (err ? console.log('CREATE ERRROR', err) : null));
		}
		return doc;
	}

	insert(doc, insert, cbErr) {
		if (!typeof instert === 'object' || Array.isArray(insert)) {
			cbErr('insert must be an object');
			return;
		}
		doc.submitOp(insert, this.type, err => (err ? cbErr(err) : null));
	}

	deleteDoc(doc, cbErr) {
		doc.del({ source: true }, err => (err ? cbErr(err) : null));
	}

	destroyDoc(doc) {
		doc.destroy();
	}
}

// module.exports = new shareDB(options);
module.exports = shareDB;
