var hapi = require('hapi')
  , joi = require('joi')
  , handlers = require('./handlers')
  , bikeRoutes = require('./routes/bikes');

var init = function(db) {
	handlers.init(db);
};

var routes = [{
  method: 'GET',
  path: '/',
  handler: handlers.index
}, {
  method: 'GET',
  path: '/{path*}',
  handler: {
  	directory: {
  		path: './public',
  		listing: false,
  		index: true
  	}
  }	
}].concat(bikeRoutes);

module.exports = {
	routes: routes,
	init: init
};