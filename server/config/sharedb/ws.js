const WebSocket = require('ws');
const shareDB = require('./sharedb');

const wsShareDB = new WebSocket.Server({
	noServer: true
});

const wrapperShareDB = new shareDB();

wsShareDB.on('connection', (socket, req) => {
	console.log('RWS::CONNECT');
	// wrapperShareDB.listen(socket);
});

setInterval(() => {}, 50000);

module.exports = wsShareDB;
