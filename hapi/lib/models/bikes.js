var db = require('../db').bikes
  , utilities = require('../utilities.js')
  , url = require('url')
  , hoek = require('hoek')
  , boom = require('boom')
  , shortid = require('shortid');

var addBike = function(options, callback) {
  var bikeUrl;
  options.item.id = shortid.generate();
  options.item.created = new Date();
  options.item.modified = new Date();

  // validate string url using node lib
  bikeUrl = url.parse(options.item.url)
  if (!bikeUrl) return callback(boom.badRequest('Url was not parsable'), null);

  options.item.host = bikeUrl.host;
  db.insert(options.item, { safe: true }, function (err, doc) {
    if (err) return callback(boom.badImplementation('Failed to add bike to db', err), null);    

    callback(null, utilities.cleanDoc(doc));
  });
};

var updateBike = function (options, callback) {
  getBike(options, function(err, doc) {
    if (doc) {
      // explicit property update
      doc.url = options.item.url;
      doc.title = options.item.title;
      doc.tags = options.item.tags;
      doc.description = options.item.description;

      // update modified timestamp
      doc.modified = new Date();

      // save changes
      db.update({ 'id': options.id }, doc, function(err, count) {
        if (!count || count === 0) {
          callback(boom.notFound('Bike not found', err), null);
        } else {
          getBike(options, callback);
        }
      });
    } else {
      callback(boom.notFound('Bike not found'), null);
    }
  });
};

var getBike = function(options, callback) {
  db.findOne({ 'id': options.id }, function(err, doc) {
    if (doc) {
      callback(null, utilities.cleanDoc(doc));
    } else {
      callback(boom.notFound('Bike not found'), null);
    }
  });
};

var getAllBikes = function(callback) {
  db.find({}, function(err, docs) {
    if (docs) {
      callback(null, docs);
    } else {
      callback(boom.notFound('No bikes found'), null);
    }
  });
};

var removeBike = function(options, callback){
  db.findAndRemove({ 'id': options.id }, function(err, doc) {
    if (!doc) {
      callback(boom.notFound('Bike not found', err), null);
    } else {
      callback(err, utilities.cleanDoc(doc)); 
    }
  });
};

var removeAllBikes = function(callback) {
  db.remove({}, function(err, count) {
    callback(err, count);
  });
};

exports.add = addBike;
exports.update = updateBike;
exports.get = getBike;
exports.getAll = getAllBikes;
exports.remove = removeBike;
exports.removeAll = removeAllBikes;