const codes = require('./codes');

class ApiError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = codes[message] || 'CODE_MISSING';
	}
}

module.exports = ApiError;
