var bike = require('Bike-Lib/models/bike');

function getBike(request, reply) {
  var options = {
    _id: request.params._id
  };

  bike.get(options).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    error(request, reply, err);
  });
}

function getBikes(request, reply) {
  bike.getAll().then(function(result) {
    render(request, reply, result);
  }, function(err) {
    error(request, reply, err);
  });
}

function addBike(request, reply) {
  var options = { item: {} } ;
  options.item = createBikeItem(request);

  bike.add(options).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    error(request, reply, err);
  });
}

function updateBike(request, reply) {
  var options = {
    _id: request.params._id,
    bike: request.payload
  };

  bike.update(options).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    error(request, reply, err);
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

  bike.remove(options).then(function(result) {
    render(request, reply, result);
  }, function(err) {
    error(request, reply, err);
  });
}

function render(request, reply, result) {
  reply(result).type('application/json; charset=utf-8');
}

function error(request, reply, err) {
  return reply(Boom.badImplementation(err));
}

exports.getBike = getBike;
exports.getBikes = getBikes;
exports.addBike = addBike;
exports.updateBike = updateBike;
exports.createBikeItem = createBikeItem;
exports.removeBike = removeBike;