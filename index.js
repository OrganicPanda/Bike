var Promise = require('es6-promise').polyfill()
  , hapi = require('hapi')
  , env = process.env.NODE_ENV
  , port = +process.env.PORT || 3000
  , host = env === 'production'
             ? '0.0.0.0'
             : 'localhost'
  , url = env === 'production'
            ? 'http://opbike.herokuapp.com'
            : 'http://localhost:' + port;

var server = new hapi.Server(host, port);

server.pack.register([{
  plugin: require('Bike-API'),
  options: { route: '/api' }
}, {
  plugin: require('Bike-App'),
  options: { route: '/' }
}, {
  plugin: require('hapi-swagger'),
  options: {
    basePath: url,
    apiVersion: '1.0.0'
  }
}], function(err) {
  if (err) {
    console.error('Couldn\'t start server!');
    throw err
  };

  server.start(function() {
    console.log('Server started at', server.info.uri);
  });
});