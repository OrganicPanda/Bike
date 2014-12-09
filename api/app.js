var Promise = require('es6-promise').polyfill()
  , hapi = require('hapi')
  , routes = require('./lib/routes')
  , port = process.env.PORT || 3000
  , serverUrl = 'http://localhost:' + port;

var server = new hapi.Server('localhost', port);

server.pack.register([{
  plugin: require('hapi-swagger'),
  options: {
    basePath: serverUrl,
    apiVersion: '1.0.0'
  }
}], function(err) {
  server.route(routes);

  server.start(function(err) {
    if (err) return console.error('Couldn\'t start server!');

    console.log('Server started at', serverUrl);
  });
});