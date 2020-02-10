function getRawStatus(history) {
	return history.reduce((acc, request) => [...acc, request.status], []);
}

module.exports = getRawStatus;
