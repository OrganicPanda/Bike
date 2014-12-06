var Url = require('url')
  , hoek = require('hoek')
  , boom = require('boom')
  , shortid = require('shortid')
  , utilities = require('./utilities.js');  

function Bikes(db) {
  var self = this;
  this.db = db;
  this.collection = this.db.collection('bikes');
}

Bikes.prototype = {
  add: function (options, callback){
    var url;
    options.item.id = shortid.generate();
    options.item.created = new Date();
    options.item.modified = new Date();

    // validate string url using node lib
    url = Url.parse(options.item.url)
    if (!url) return callback(boom.badRequest('Url was not parsable'), null);

    options.item.host = url.host;
    this.collection.insert(options.item, { safe: true }, function (err, doc) {
      if (err) return callback(boom.badImplementation('Failed to add bike to db', err), null);    

      callback(null, utilities.cleanDoc(doc));
    });
  },

  // update an existing bike
  update: function (options, callback){
    var self = this;

    this.get(options, function(err, doc){
      if (doc) {
        // explicit property update
        doc.url = options.item.url;
        doc.title = options.item.title;
        doc.tags = options.item.tags;
        doc.description = options.item.description;

        // update modified timestamp
        doc.modified = new Date();

        // save changes
        self.collection.update( {'id': options.id}, doc, function(err, count){
            if(!count || count === 0){
                callback(boom.notFound('Bike not found', err), null);
            }else{
                self.get(options, callback);
            }
        });

      }else{
          callback(boom.notFound('Bike not found'), null);
      }
    });
  },

  // get a single bike
  get: function(options, callback){
      this.collection.findOne( {'id': options.id}, function(err, doc){
          if(doc){
              callback(null, utilities.cleanDoc(doc));
          }else{
              callback(boom.notFound('Bike not found'), null);
          }
      });
  },

  // find a list of bike that match a query
  find: function(options, callback){
      var cursor,
          defaults,
          skipFrom,
          self = this;

      defaults = {
          page: 1,
          pageSize: 10,
          sort: {modified:-1},
          query: {}
      }

      options = hoek.applyToDefaults(defaults, options);
      skipFrom = (options.page * options.pageSize) - options.pageSize;

      // create and fire query
      cursor = this.collection.find(options.query)
          .skip(skipFrom)
          .limit(options.pageSize)
          .sort(options.sort)

      // process results
      cursor.toArray(function(err, docs) {
          if (err) {
              callback({'error': err});
          } else {
              cursor.count(function(err, count) {
                  if (err) {
                      callback(err, null);
                  }else{
                      var i = docs.length;
                      while (i--) {
                          docs[i] = utilities.cleanDoc(docs[i]);
                      }
              
                      callback(null, {
                          'items': docs,
                          'count': count,
                          'pageSize': options.pageSize,
                          'page': options.page,
                          'pageCount': Math.ceil(count / options.pageSize)
                      });
                  }
              });
          }
      });
  },


  // remove bike from collection using id
  remove: function(options, callback){
      this.collection.findAndRemove({'id': options.id}, function(err, doc) {
          if(!doc){
              callback(boom.notFound('Bike not found', err), null);
          }else{
              callback(err, utilities.cleanDoc(doc)); 
          }
      });
  },



  // remove all bike from collection
  removeAll: function(callback){
      this.collection.remove({}, function(err, count) {
          console.log(err, count)
          callback(err, count);
      });
  }
};

module.exports = Bikes;