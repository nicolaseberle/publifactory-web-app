'use strict';

const environment = (process.env.NODE_ENV || 'development').trim();

console.log("--------------ENV-------------", environment);

if (environment === 'development') {
    module.exports = require('./config/webpack.config.dev');
} else {
    console.log("USING PROD")
    module.exports = require('./config/webpack.config.prod');
}
