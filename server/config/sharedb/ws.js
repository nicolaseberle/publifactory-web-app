const WebSocket = require('ws');
const shareDB = require('./sharedb');

const wsShareDB = new WebSocket.Server({
	noServer: true
});

const wrapperShareDB = new shareDB();

wsShareDB.on('connection', (socket, req) => {
	console.log('RWS::CONNECT');
	wrapperShareDB.listen(socket);
	socket.on('message', _ => {
		try {
			const packet = JSON.parse(_);
			if (!packet.event || !packet.data || packet.event !== 'CONNECT') return;
			console.log('RWS::CLIENT::MSG', packet);
		} catch (error) {
			return;
		}
	});
});

(function cleanClosedConnections() {
	setInterval(() => {
		wsShareDB.clients.forEach(socket => {
			if (socket.readyState === 3) {
				socket.removeAllListeners();
				socket.terminate();
			}
		});
	}, 50000);
})();

module.exports = wsShareDB;
