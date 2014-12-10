var Promise = require('es6-promise').polyfill()
  , hapi = require('hapi')
  , routes = require('./lib/routes')
  , env = process.env.NODE_ENV
  , port = +process.env.PORT || 3000
  , host = env === 'production'
             ? '0.0.0.0'
             : 'localhost'
  , url = env === 'production'
            ? 'http://op-bike.herokuapp.com'
            : 'http://localhost:' + port;

var server = new hapi.Server(host, port);

server.pack.register([{
  plugin: require('hapi-swagger'),
  options: {
    basePath: url,
    apiVersion: '1.0.0'
  }
}], function(err) {
  server.route(routes);

  server.start(function(err) {
    if (err) return console.error('Couldn\'t start server!');

    console.log('Server started at', server.info.uri);
  });
});