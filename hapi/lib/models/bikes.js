var db = require('../db')
  , mongo = require('mongojs')
  , url = require('url')
  , joi = require('joi')
  , hoek = require('hoek')
  , boom = require('boom')
  , merge = require('merge');

var validSize = joi.object({
  seatTubeLength: joi.number().optional()
    .description('Seat Tube Length (mm)'),
  headTubeAngle: joi.number().optional()
    .description('Head Tube Angle (deg)'),
  headTubeLength: joi.number().optional()
    .description('Head Tube Length (mm)'),
  seatTubeAngle: joi.number().optional()
    .description('Seat Tube Angle (deg)'),
  chainStayLength: joi.number().optional()
    .description('Chain Stay Length (mm)'),
  bottomBracketDrop: joi.number().optional()
    .description('Bottom Bracket Drop (mm)'),
  straightForkLength: joi.number().optional()
    .description('Straight Fork Length (mm)')
}).min(1).description('A size object');

var props = {
  _id: joi.string().description('The bike identifier'),
  model: joi.string().description('The bike model'),
  brand: joi.string().description('The bike brand'),
  url: joi.string().description('A URL for this bike'),
  sizes: joi.object()
    .pattern(/.*/, validSize)
    .min(1)
    .description('A collection of size objects')
};

var addBike = function(options, callback) {
  var bikeUrl;
  options.item.created = new Date();
  options.item.modified = new Date();

  db().then(function(bikes) {
    bikes.insert(options.item, { safe: true }, function (err, doc) {
      if (err) {
        return callback(
          boom.badImplementation('Failed to add bike to db', err), null);
      }

      callback(null, doc);
    });
  });
};

var updateBike = function (options, callback) {
  getBike(options, function(err, doc) {
    if (doc) {
      doc.modified = new Date();

      // explicit property update
      if (options.bike.model) doc.model = options.bike.model;
      if (options.bike.brand) doc.brand = options.bike.brand;
      if (options.bike.url) doc.url = options.bike.url;
      if (options.bike.sizes) {
        doc.sizes = merge.recursive(true, doc.sizes, options.bike.sizes);
      }

      db().then(function(bikes) {
        var query = { _id: mongo.ObjectId(options._id) };

        bikes.update(query, doc, function(err, count) {
          if (!count || count === 0) {
            callback(boom.notFound('Bike not found', err), null);
          } else {
            getBike(options, callback);
          }
        });
      });
    } else {
      callback(boom.notFound('Bike not found'), null);
    }
  });
};

var getBike = function(options, callback) {
  db().then(function(bikes) {
    bikes.findOne({ '_id': mongo.ObjectId(options._id) }, function(err, doc) {
      if (doc) {
        callback(null, doc);
      } else {
        callback(boom.notFound('Bike not found'), null);
      }
    });
  });
};

var getAllBikes = function(callback) {
  db().then(function(bikes) {
    bikes.find({}, function(err, docs) {
      if (docs) {
        callback(null, docs);
      } else {
        callback(boom.notFound('No bikes found'), null);
      }
    });
  });
};

var removeBike = function(options, callback) {
  db().then(function(bikes) {
    bikes.remove({ '_id': mongo.ObjectId(options._id) }, function(err, doc) {
      if (!doc) {
        callback(boom.notFound('Bike not found', err), null);
      } else {
        callback(err, doc);
      }
    });
  });
};

var removeAllBikes = function(callback) {
  db().then(function(bikes) {
    bikes.remove({}, function(err, count) {
      callback(err, count);
    });
  });
};

exports.props = props;
exports.add = addBike;
exports.update = updateBike;
exports.get = getBike;
exports.getAll = getAllBikes;
exports.remove = removeBike;
exports.removeAll = removeAllBikes;