var hapi = require('hapi')
  , routes = require('./lib/routes');

var server = new hapi.Server('localhost', 3005);

server.route(routes);
server.views({
	path: './templates',
	engines: { html: require('handlebars') },
	partialsPath: './templates/withPartials',
	helpersPath: './templates/helpers',
	isCached: false
});

server.start();