var hapi = require('hapi')
  , joi = require('joi')
  , handlers = require('./handlers')
  , routes;

routes = [{
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
}];

module.exports = routes;