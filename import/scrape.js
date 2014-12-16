var request = require('request')
  , Promise = require('es6-promise').Promise
  , cheerio = require('cheerio')
  , db = require('./db');

var baseUrl = 'http://www.chargebikes.com';

var bikeProps = {
  seatTubeLength: 'Seat Tube Length (mm)',
  headTubeAngle: 'Head Angle',
  headTubeLength: 'Head Tube Length (mm)',
  seatTubeAngle: 'Seat Angle',
  chainStayLength: 'Chainstay Length (mm)',
  bottomBracketDrop: 'BB Drop (mm)',
  straightForkLength: 'Recommended Fork Length'
};

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
    return !url.match(ignore);
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
  var doFetch = function(bike) {
    console.log('bike.geometryUrl', bike.geometryUrl);

    return get(bike.geometryUrl)
      .then(function(geometryData) {
        bike.geometryData = geometryData;

        return bike;
      });
  };

  return Promise.all(bikes.map(doFetch));
};

var parseGeometryRow = function(row, sizes) {
  var cells = row.children('td')
    , parsed = {
        label: row.children('th').text()
      };

  sizes.forEach(function(size, index) {
    parsed[size] = parseFloat(cells.eq(index).text());
  });

  return parsed;
};

var extractSizes = function($) {
  var sizes = []
    , row = $('thead tr').eq(0)
    , headers = row.children('th');

  return headers.map(function() {
    return $(this).text();
  }).get().filter(function(size) {
    return size !== '';
  });
};

var keyForProp = function(prop) {
  for (var key in bikeProps) {
    if (bikeProps[key] === prop) return key;
  }
};

var propForKey = function(key) {
  return bikeProps[key];
};

var requiredProp = function(prop) {
  return !!keyForProp(prop.label);
};

var compileSizes = function(properties) {
  var sizes = {};

  properties.forEach(function(property) {
    var label = keyForProp(property.label);

    Object.keys(property).filter(function(key) {
      return key !== 'label';
    }).forEach(function(key) {
      if (!sizes[key]) sizes[key] = {};

      sizes[key][label] = property[key];
    });
  });

  return sizes;
};

var parseGeometry = function(bikes) {
  bikes.forEach(function(bike) {
    var $ = cheerio.load(bike.geometryData)
      , sizes = extractSizes($)
      , rows = $('tbody tr')
      , extracted = [];

    rows.each(function() {
      var parsed = parseGeometryRow($(this), sizes);

      extracted.push(parsed);
    });

    extracted = extracted.filter(requiredProp);

    bike.sizes = compileSizes(extracted);
  });

  return Promise.resolve(bikes);
};

var save = function(bikes) {
  var doSave = function(bike) {
    return new Promise(function(resolve, reject) {
      // db.bikes.findAndModify({
      //   query: { id: bike.id },
      //   update: bike,
      //   new: true,
      //   upsert: true
      // }, function(err, doc) {
      //   if (err) reject(err);

      //   resolve(doc);
      // });
      console.log('save', bike);
      resolve(bike);
    });
  };

  return Promise.all(bikes.map(doSave));
};

get(baseUrl + '/js/main.js')
  .then(extractBikes)
  .then(fetchGeometry)
  .then(parseGeometry)
  .then(save)
  .then(function(bikes) {
    console.log('Bikes Saved');
  }).catch(function(error) {
    console.log("Failed!", error);
  });