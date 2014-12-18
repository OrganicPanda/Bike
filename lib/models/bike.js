var db = require('../db')
  , mongo = require('mongod')
  , joi = require('joi')
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

var id = function(_id) {
  try {
    return mongo.ObjectId(_id);
  } catch(e) {
    return null;
  }
}

var addBike = function(options) {
  var bikeUrl;
  options.item.created = new Date();
  options.item.modified = new Date();

  return db.bikes.insert(options.item, { safe: true });
};

var updateBike = function (options) {
  return getBike(options).then(function(doc) {
    doc.modified = new Date();

    // explicit property update
    if (options.bike.model) doc.model = options.bike.model;
    if (options.bike.brand) doc.brand = options.bike.brand;
    if (options.bike.url) doc.url = options.bike.url;
    if (options.bike.sizes) {
      doc.sizes = merge.recursive(true, doc.sizes, options.bike.sizes);
    }

    return db.bikes.update({ _id: doc._id }, doc)
  }).then(function(count) {
    if (!count || count === 0) {
      return Promise.reject('Bike not updated');
    }

    return getBike(options);
  });
};

var getBike = function(options) {
  var _id = id(options._id);

  if (!_id) return Promise.reject('ID not valid');

  return db.bikes.findOne({ _id: _id });
};

var getAllBikes = function() {
  return db.bikes.find({});
};

var removeBike = function(options) {
  var _id = id(options._id);

  if (!_id) return Promise.reject('ID not valid');

  return db.bikes.remove({ _id: _id });
};

var removeAllBikes = function() {
  return db.bikes.remove({});
};

exports.props = props;
exports.add = addBike;
exports.update = updateBike;
exports.get = getBike;
exports.getAll = getAllBikes;
exports.remove = removeBike;
exports.removeAll = removeAllBikes;