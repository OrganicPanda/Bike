var bikeModel = require('Bike-Lib/models/bike')
  , boom = require('boom');

function getBike(request, reply) {
  var options = {
    _id: request.params._id
  };

  bikeModel.get(options).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    reply(boom.notFound('Bike not found'));
  });
}

function getBikes(request, reply) {
  bikeModel.getAll().then(function(result) {
    render(request, reply, result);
  }, function(err) {
    reply(boom.badImplementation(err));
  });
}

function addBike(request, reply) {
  var bike = createBikeItem(request);

  bikeModel.add(bike).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    reply(boom.badRequest(err));
  });
}

function updateBike(request, reply) {
  var options = {
    _id: request.params._id,
    bike: request.payload
  };

  bikeModel.update(options).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    reply(boom.badRequest(err));
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

  bikeModel.remove(options).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    reply(boom.badRequest(err));
  });
}

function render(request, reply, result) {
  reply(result).type('application/json; charset=utf-8');
}

exports.getBike = getBike;
exports.getBikes = getBikes;
exports.addBike = addBike;
exports.updateBike = updateBike;
exports.createBikeItem = createBikeItem;
exports.removeBike = removeBike;