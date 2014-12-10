var mongo = require('mongojs')
  , uri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/bikes-hapi'
  , bikesDb;

module.exports = function() {
  if (bikesDb) return Promise.resolve(bikesDb);

  return new Promise(function(resolve, reject) {
    var db = mongo.connect(uri, ['bikes']);

    db.on('error',function(err) {
      console.log('database error', err);
    });

    db.on('ready',function() {
      console.log('database connected');
    });

    bikesDb = db.bikes;

    resolve(bikesDb);
  });
};