'use strict';

const mongoose = require('mongoose');
const config = require('../../config').backend;

module.exports = function (ssl) {
  const options = {
    sslCert: ssl.cert,
    sslKey: ssl.key
  };
  mongoose.connect(config.mongo.uri, options).then(() => console.log('Server is connected to mongoDB.'));
};
