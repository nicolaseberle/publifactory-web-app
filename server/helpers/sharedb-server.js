var ShareDB = require('sharedb');
var config = require('../config').backend

ShareDB.types.register(require('rich-text').type);


module.exports = new ShareDB({
  db: require('sharedb-mongo')( config.mongo.uri + '?auto_reconnect=true')
});
