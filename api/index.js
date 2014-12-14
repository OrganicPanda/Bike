var routes = require('./lib/routes')
  , clone = require('clone')
  , urljoin = require('url-join');

exports.register = function(plugin, options, next) {
  var basePath = options.route || '/';

  plugin.route(routes.map(function(route) {
    route = clone(route);

    route.path = urljoin(basePath, route.path);

    return route;
  }));

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};