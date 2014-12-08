var Promise = require('es6-promise').polyfill()
  , hapi = require('hapi')
  , routes = require('./lib/routes');

var server = new hapi.Server('localhost', 3005);

server.pack.register([{
  plugin: require('hapi-swagger'),
  options: {
    basePath: 'http://localhost:3005',
    apiVersion: '1.0.0'
  }
}], function(err) {
  server.route(routes);
  server.views({
    path: './templates',
    engines: { html: require('handlebars') },
    partialsPath: './templates/withPartials',
    helpersPath: './templates/helpers',
    isCached: false
  });

  server.start(function(err) {
    if (err) return console.error('Couldn\'t start server!');

    console.log('Server started');
  });
});