const WebSocket = require('ws');
const ShareDB = require('sharedb');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const richText = require('rich-text');

const wsShareDB = new WebSocket.Server({
	noServer: true
});

// const wrapperShareDB = new shareDB();
ShareDB.types.register(richText.type);

var backend = new ShareDB();
var connection = backend.connect();

wsShareDB.on('connection', (socket, req) => {
	console.log('##RWS::CONNECT');
	// wrapperShareDB.listen(socket);
	var stream = new WebSocketJSONStream(socket);
	backend.listen(stream);
});

module.exports = wsShareDB;
