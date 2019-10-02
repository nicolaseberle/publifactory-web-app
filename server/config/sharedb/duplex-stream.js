const { Duplex } = require('stream');
const util = require('util');

class DuplexStream extends Duplex {
	constructor(options) {
		// option for shareDB - readableObjectMode && writableObjectMode
		super({ ...options, readableObjectMode: true, writableObjectMode: true });
		this.queue = [];
	}

	_write(chunk, encoding, callback) {
		this.queue.push(chunk);
		callback();
	}

	_read(size) {
		const retain = this.queue.pop() || null;
		if (retain) {
			this.push(retain);
		}
	}
}

util.inherits(DuplexStream, Duplex);
module.exports = DuplexStream;
