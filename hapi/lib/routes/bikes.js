var hapi = require('hapi')
  , joi = require('joi')
  , bike = require('../models/bikes')
  , handlers = require('../handlers/bikes');

module.exports = [{
  method: 'GET',
  path: '/bikes/{_id}',
  config: {
    handler: handlers.getBike,
    description: 'Get bike',
    notes: ['Get a bike from the collection'],
    tags: ['api', 'public'],
    validate: {
      params: {
        _id: bike.props._id.required()
      }
    }
  }
}, {
  method: 'GET',
  path: '/bikes/',
  config: {
    handler: handlers.getBikes,
    description: 'Get bikes',
    notes: ['Gets a list of bikes from the collection'],
    tags: ['api', 'public']
  }
}, {
  method: 'POST',
  path: '/bikes/',
  config: {
    handler: handlers.addBike,
    description: 'Add bike',
    notes: ['Adds a bike to the collection'],
    tags: ['api', 'public'],
    validate: {
      payload: {
        model: bike.props.model.required(),
        brand: bike.props.brand.required(),
        url: bike.props.url.optional(),
        sizes: bike.props.sizes.required()
      }
    }
  }
}, {
  method: 'PUT',
  path: '/bikes/{_id}',
  config: {
    handler: handlers.updateBike,
    description: 'Update bike',
    notes: ['Update a bike in the collection'],
    tags: ['api', 'public'],
    validate: {
      params: {
        _id: bike.props._id.required()
      },
      payload: {
        model: bike.props.model.optional(),
        brand: bike.props.brand.optional(),
        url: bike.props.url.optional(),
        sizes: bike.props.sizes.optional()
      }
    }
  }
}, {
  method: 'DELETE',
  path: '/bikes/{_id}',
  config: {
    handler: handlers.removeBike,
    description: 'Delete bike',
    notes: ['Deletes a bike from the collection'],
    tags: ['api', 'public'],
    validate: {
      params: {
        _id: bike.props._id.required()
      }
    }
  }
}];