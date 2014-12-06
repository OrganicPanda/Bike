var hapi = require('hapi')
  , routes = require('./lib/routes')
  , mongo = require('mongodb');

var dbUri = 'mongodb://localhost:27017/bikes-hapi'
  , db;

var swaggerOptions = {
	basePath: 'http://localhost:3005',
	apiVersion: '1.0.0'
};

var init = function() {
	routes.init(db);

	var server = new hapi.Server('localhost', 3005);

	server.pack.register([{
		plugin: require('hapi-swagger'),
		options: swaggerOptions
	}], function(err) {
		server.route(routes.routes);
		server.views({
			path: './templates',
			engines: { html: require('handlebars') },
			partialsPath: './templates/withPartials',
			helpersPath: './templates/helpers',
			isCached: false
		});
		
		server.start();
	});
}

mongo.MongoClient.connect(dbUri, {
	'server': { 'auto_reconnect': true }
}, function (err, dbObj) {
  if (err) return console.log(['error', 'database', 'connection'], err);
  
  db = dbObj;
  init();
});