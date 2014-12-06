var hapi = require('hapi')
  , routes = require('./lib/routes')
  , db = require('./lib/db');

db.init(function(err) {
  if (err) return console.error('DB Error: Couldn\'t start server!');

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
      if (err) return console.error('Web Server Error: Couldn\'t start server!');

      console.log('Server started');
    });
  });
});