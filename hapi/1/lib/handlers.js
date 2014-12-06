var fs = require('fs')
  , path = require('path')
  , hapi = require('hapi')
  , boom = require('boom')
  , joi = require('joi')
  , bcrypt = require('bcrypt-nodejs')
  // , Users = require('../lib/users.js').Users
  // , Tokens = require('../lib/tokens.js').Tokens
  , Bikes = require('./bikes.js')
  , bikes;
  // , utils = require('../lib/utilities.js')
  // , pack = require('../package');

var init = function(db) {
	bikes = new Bikes(db);
};

function index(request, reply) {
  reply.view('index.html', { title: 'Woot' });
}

function getBike(request, reply) { 
	var options = {
			id: request.params.id
		};
	bikes.get( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function getBikes(request, reply) { 
	var options = {
		query: {}
	};

	// add defaults for paging
	options.page = (request.query.page)? parseInt( request.query.page, 10 ) : 1;
	options.pageSize = (request.query.pagesize)? parseInt( request.query.pagesize, 10 ) : 20;

	bikes.find( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function addBike (request, reply) { 
	var options = {item: {}};
	options.item = createBikeItem(request);

	bikes.add( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


function updateBike (request, reply) { 
	var options = {
		item: {},
		id: request.params.id
	};
	options.item = createBikeItem(request);

	bikes.update( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}


// common function for add and update
function createBikeItem(request){
	var item = {}

	if(request.payload){
		item = request.payload;
	}
	
	if(request.query.url){
		item = {
			url: request.query.url,
			title: request.query.title,
			tags: request.query.tags,
			description: request.query.description
		};
	}
	// turn tag string into an array
	if(Utils.isString(item.tags)){
		if(item.tags.indexOf(',') > -1){
			item.tags = Utils.trimItemsOfArray(item.tags.split(',')) ;
		}else{
			item.tags = [Utils.trim(item.tags)];
		}
	}
	return item;
}



function removeBike (request, reply) { 
	var options = {
			id: request.params.id
		};
	bikes.remove( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}

// render json out to http stream
function renderJSON( request, reply, err, result ){
	if (err) {
		if ( Utils.isString( err ) ){
			// error without a code are returned as 500
			reply( Boom.badImplementation(err) );
		} else {
			reply( err );
		}
	} else {
		reply(result).type('application/json; charset=utf-8');
	}
}

module.exports = {
	index: index,
	init: init,
	getBike: getBike,
	getBikes: getBikes,
	addBike: addBike,
	updateBike: updateBike,
	createBikeItem: createBikeItem,
	removeBike: removeBike,
	renderJSON: renderJSON
};