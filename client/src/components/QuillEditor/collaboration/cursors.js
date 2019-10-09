/**
 * Holding foreign cursors in an Array
 * Shared on all quillEditor instance
 */
class Cursors {
	constructor() {
		this.local = null;
		this.cursors = [];
		this.vm = [];
	}

	register(vm) {}
	setLocalCursor() {}
	getLocalCursor() {}
	setForeignCursor() {}
	getForeignCursor() {}
}

module.exports = new Cursors();
