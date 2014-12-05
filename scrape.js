var request = require('request')
  , Promise = require('es6-promise').Promise
  , cheerio = require('cheerio');

var baseUrl = 'http://www.chargebikes.com';

var get = function(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(err, resp, body) {
      if (err) reject(err);

      resolve(body);
    });
  });
};

var extractBikes = function(body) {
  var bikeUrls = body.match(/url: ?"(.*?)"/ig)
    , bikeUrl = /url: ?"(.*?)"/i
    , ignore = /(bicycle-collection|parts-collection)/i
    , results = [];

  return Promise.resolve(bikeUrls.filter(function(url) {
    return !url.match(ignore) && url.match(/plug-3/);
  }).map(function(url) {
    return url.match(bikeUrl)[1];
  }).map(function(url) {
    var bits = url.split('/')
      , id = bits[bits.length - 1];

    return {
      id: id,
      url: baseUrl + url,
      geometryUrl: baseUrl + '/geometry/' + id + '.dat'
    } 
  }));
};

var fetchGeometry = function(bikes) {
  var fetch = function(bike) {
    return get(bike.geometryUrl)
      .then(function(geometryData) {
        bike.geometryData = geometryData;

        return bike;
      });
  };

  return Promise.all(bikes.map(fetch));
};

var parseGeometryRow = function(row) {
  return {
    label: row.children('th').text(),
    xs: row.children('td').eq(0).text(),
    s: row.children('td').eq(1).text(),
    m: row.children('td').eq(2).text(),
    l: row.children('td').eq(3).text(),
    xl: row.children('td').eq(4).text()
  };
};

var parseGeometry = function(bikes) {
  bikes.forEach(function(bike) {
    var $ = cheerio.load(bike.geometryData)
      , rows = $('tbody tr')
      , extracted = [];

    rows.each(function() {
      extracted.push(parseGeometryRow($(this)))
    });

    bike.geometryData = extracted;
  });

  return Promise.resolve(bikes);
};

get(baseUrl + '/js/main.js')
  .then(extractBikes)
  .then(fetchGeometry)
  .then(parseGeometry)
  .then(function(bikes) {
    console.log('bikes', JSON.stringify(bikes));
  }).catch(function(error) {
    console.log("Failed!", error);
  });