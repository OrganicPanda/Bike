var bikes = require('../models/bikes.js');

function getBike(request, reply) {
  var options = {
    _id: request.params._id
  };

  bikes.get(options, function(error, result) {
    renderJSON(request, reply, error, result);
  });
}

function getBikes(request, reply) {
  bikes.getAll(function(error, result) {
    renderJSON(request, reply, error, result);
  });
}

function addBike(request, reply) {
  var options = { item: {} } ;
  options.item = createBikeItem(request);

  bikes.add(options, function(error, result) {
    renderJSON(request, reply, error, result);
  });
}

function updateBike(request, reply) {
  var options = {
    _id: request.params._id,
    bike: request.payload
  };

  console.log('options', options);

  bikes.update(options, function(error, result) {
    renderJSON(request, reply, error, result);
  });
}

// common function for add and update
function createBikeItem(request) {
  var item = {}

  if (request.payload) {
    item = request.payload;
  }

  return item;
}

function removeBike(request, reply) {
  var options = {
    _id: request.params._id
  };

  bikes.remove(options, function(error, result) {
    renderJSON(request, reply, error, result);
  });
}

// render json out to http stream
function renderJSON(request, reply, err, result) {
  if (err) return reply(Boom.badImplementation(err));

  reply(result).type('application/json; charset=utf-8');
}

exports.getBike = getBike;
exports.getBikes = getBikes;
exports.addBike = addBike;
exports.updateBike = updateBike;
exports.createBikeItem = createBikeItem;
exports.removeBike = removeBike;