var mongo = require('mongodb')
  , uri = 'mongodb://localhost:27017/bikes-hapi'
  , bikesDb;

exports.init = function(cb) {
  mongo.MongoClient.connect(uri, {
    'server': { 'auto_reconnect': true }
  }, function (err, db) {
    bikesDb = db;
    
    return cb(err, db);
  });
};

exports.bikes = bikesDb;