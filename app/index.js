var urljoin = require('url-join')
  , path = require('path');

exports.register = function(plugin, options, next) {
  plugin.route([{
    method: 'GET',
    path: urljoin(options.route || '/', '/vendor/{param*}'),
    handler: {
      directory: {
        path: path.join(__dirname, '/vendor')
      }
    }
  }, {
    method: 'GET',
    path: urljoin(options.route || '/', '/{param*}'),
    handler: {
      directory: {
        path: path.join(__dirname, '/public')
      }
    }
  }]);

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};