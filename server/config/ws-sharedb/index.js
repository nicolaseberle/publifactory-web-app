const WebSocket = require('ws');
const ShareDB = require('sharedb');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const richText = require('rich-text');

const wsShareDB = new WebSocket.Server({
	noServer: true
});

// const options = {
// 	db: ShareDB.MemoryDB(),
// 	pubsub: ShareDB.MemoryPubSub()
// };

ShareDB.types.register(richText.type);

const backend = new ShareDB();
backend.connect();

wsShareDB.on('connection', (socket, req) => {
	console.log('WSSHAREDB::NEW::CLIENT');
	var stream = new WebSocketJSONStream(socket);
	backend.listen(stream);
});

module.exports = wsShareDB;
