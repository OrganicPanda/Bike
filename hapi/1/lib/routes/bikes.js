var hapi = require('hapi')
  , joi = require('joi')
  , handlers = require('../handlers');

module.exports = [{
  method: 'GET',
  path: '/bikes/{id}',
  config: {
    handler: handlers.getBike,
    description: 'Get bike',
    notes: ['Get a bike from the collection'],
    plugins: {
      // 'hapi-swagger': {
      //   responseMessages: extendedHTTPErrors
      // }
    },
    tags: ['api', 'public'],
    validate: { 
      params: {
        id: joi.string()
          .required()
          .description('the id of the bike in the collection')
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
    plugins: {
      // 'hapi-swagger': {
      //   responseMessages: standardHTTPErrors
      // }
    },
    tags: ['api', 'public'],
    validate: { 
      query: {
        page: joi.number()
          .description('the page number')
          .optional()
          .default(1)
          .min(0),

        pagesize: joi.number()
          .description('the number of items to a page')
          .optional()
          .default(10)
          .min(0)
          .max(1000)
      }
    }
  }
}, {
  method: 'POST',
  path: '/bikes/',
  config: {
    handler: handlers.addBike,
    description: 'Add bike',
    notes: ['Adds a bike to the collection'],
    plugins: {
      // 'hapi-swagger': {
      //   responseMessages: standardHTTPErrors,
      //   payloadType: 'form'
      // }
    },
    tags: ['api', 'public'],
    // auth: {
    //   strategies:['bearer']
    // },
    validate: {
      // headers: joi.object({
      //     Authorization: joi.string()
      //         .default('Bearer ')
      //         .description('bearer token takes "Bearer " and token'),
      //       }).unknown(),

      payload: {
        url: joi.string()
          .required()
          .description('the url to bike'),

        title: joi.string()
          .optional()
          .description('a title for the page'),

        tags: joi.string()
          .optional()
          .description('a comma delimited list of tags'),

        description: joi.string()
          .optional()
          .description('description for the page content')
      }
    }
  }
}, {
  method: 'PUT',
  path: '/bikes/{id}',
  config: {
    handler: handlers.updateBike,
    description: 'Update bike',
    notes: ['Update a bike in the collection'],
    plugins: {
      // 'hapi-swagger': {
      //   responseMessages: extendedHTTPErrors,
      //   payloadType: 'form'
      // }
    },
    tags: ['api', 'public'],
    // auth: {
    //   strategies:['bearer']
    // },
    validate: {
      // headers: joi.object({
      //     Authorization: joi.string()
      //         .default('Bearer ')
      //         .description('bearer token takes "Bearer " and token'),
      //       }).unknown(),

      params: {
        id: joi.string()
          .required()
          .description('the id of the sum in the store')
      }, 
      payload: {
        url: joi.string()
          .required()
          .description('the url to bike'),

        title: joi.string()
          .optional()
          .description('a title for the page'),

        tags: joi.string()
          .optional()
          .description('a comma delimited list of tags'),

        description: joi.string()
          .optional()
          .description('description for the page content')
      }
    }
  }
}, {
  method: 'DELETE',
  path: '/bikes/{id}',
  config: {
    handler: handlers.removeBike,
    description: 'Delete bike',
    notes: ['Deletes a bikes from the collection'],
    plugins: {
      // 'hapi-swagger': {
      //   responseMessages: extendedHTTPErrors
      // }
    },
    tags: ['api', 'public'],
    // auth: {
    //   strategies:['bearer']
    // },
    validate: {
      // headers: joi.object({
      //     Authorization: joi.string()
      //         .default('Bearer ')
      //         .description('bearer token takes "Bearer " and token'),
      //       }).unknown(),

      params: {
        id: joi.string()
          .required()
          .description('the id of the bike in the collection')
      }
    }
  }
}];