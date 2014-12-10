var Promise = require('es6-promise').polyfill()
  , hapi = require('hapi')
  , routes = require('./lib/routes')
  , host = '0.0.0.0'
  , port = +process.env.PORT || 3000;

var server = new hapi.Server(host, port);

server.pack.register([{
  plugin: require('hapi-swagger'),
  options: {
    basePath: 'http://' + host + ':' + port,
    apiVersion: '1.0.0'
  }
}], function(err) {
  server.route(routes);

  server.start(function(err) {
    if (err) return console.error('Couldn\'t start server!');

    console.log('Server started at', server.info.uri);
  });
});