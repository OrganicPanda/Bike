var hapi = require('hapi')
  , routes = require('./lib/routes');

var server = new hapi.Server('localhost', 3005);

server.route(routes);

server.start();