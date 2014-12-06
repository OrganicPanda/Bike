var fs = require('fs')
  , path = require('path')
  , hapi = require('hapi')
  , boom = require('boom')
  , joi = require('joi')
  , bcrypt = require('bcrypt-nodejs');
  // , Users = require('../lib/users.js').Users
  // , Tokens = require('../lib/tokens.js').Tokens
  // , Bikes = require('../lib/Bikes.js').Bikes
  // , utils = require('../lib/utilities.js')
  // , pack = require('../package');

function index(request, reply) {
  reply.view('index.html', { title: 'Woot' });
}

exports.index = index;