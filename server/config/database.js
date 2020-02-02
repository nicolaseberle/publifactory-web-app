'use strict';

const mongoose = require('mongoose');
const config = require('../../config').backend;

module.exports = function () {
  mongoose.connect("mongodb://mongo/").then(() => console.log('Server is connected to mongoDB.'));
};
