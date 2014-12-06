var mongo = require('mongojs');

var uri = 'mongodb://localhost:27017/bike'
  , db = mongo.connect(uri, ['bikes']);

db.on('error',function(err) {
  console.log('database error', err);
});

db.on('ready',function() {
  console.log('database connected');
});

module.exports = db;