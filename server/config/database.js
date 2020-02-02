'use strict';

const mongoose = require('mongoose');
const config = require('../../config').backend;

module.exports = function () {
  mongoose.connect(config.mongo.uri).then(() => console.log('Server is connected to mongoDB.'));
};
