var bikes = require('../models/bikes.js');

function getBike(request, reply) { 
  var options = {
    id: request.params.id
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
    item: {},
    id: request.params.id
  };
  
  options.item = createBikeItem(request);

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
  
  if (request.query.url) {
    item = {
      url: request.query.url,
      title: request.query.title,
      tags: request.query.tags,
      description: request.query.description
    };
  }
  // turn tag string into an array
  if (Utils.isString(item.tags)) {
    if (item.tags.indexOf(',') > -1) {
      item.tags = Utils.trimItemsOfArray(item.tags.split(','));
    } else {
      item.tags = [Utils.trim(item.tags)];
    }
  }
  return item;
}

function removeBike(request, reply) { 
  var options = {
    id: request.params.id
  };
  
  bikes.remove(options, function(error, result) {
    renderJSON(request, reply, error, result);
  }); 
}

// render json out to http stream
function renderJSON(request, reply, err, result) {
  if (err) {
    if (Utils.isString(err)) {
      // error without a code are returned as 500
      reply(Boom.badImplementation(err));
    } else {
      reply(err);
    }
  } else {
    reply(result).type('application/json; charset=utf-8');
  }
}

exports.getBike = getBike;
exports.getBikes = getBikes;
exports.addBike = addBike;
exports.updateBike = updateBike;
exports.createBikeItem = createBikeItem;
exports.removeBike = removeBike;