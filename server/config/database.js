'use strict';

const mongoose = require('mongoose');
const config = require('../../config').backend;

module.exports = function () {
	const options = {
		useNewUrlParser: true,
		poolSize: 10,
		reconnectTries: 3
	};
	mongoose.connect(config.mongo.uri, options)
		.then(() => console.log('Server is connected to mongoDB.'))
		.catch(error => console.log(error));
};
