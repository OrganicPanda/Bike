var baseRoutes = require('./routes/base')
  , bikeRoutes = require('./routes/bikes');

var routes = baseRoutes.concat(bikeRoutes);

module.exports = routes;