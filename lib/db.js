var mongo = require('mongod')
  , uri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/bikes'
  , db = mongo(uri, ['bikes']);

module.exports = db;