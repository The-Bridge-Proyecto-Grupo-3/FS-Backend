const security = require('../security');

module.exports = {
	'/drivers': {
		get: {
			tags: ['Drivers'],
			summary: 'Lists all drivers',
			security: security.jwt,
			responses: {
				200: {
					description: 'List all drivers',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: { $ref: '#/components/schemas/Driver' }
							}
						}
					}
				},
				403: { description: 'Access forbidden. Only admins or companies' }
			}
		},
		post: {
			tags: ['Drivers'],
			summary: 'Register a driver',
			security: security.jwt,
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/DriverInput' }
					}
				}
			},
			responses: {
				201: { description: 'Registered driver' }
			}
		}
	},
	'/drivers/{id}': {
		get: {
			tags: ['Drivers'],
			summary: 'Get a driver by ID',
			security: security.jwt,
			parameters: [
				{ name: 'id', in: 'path', required: true, description: 'ID of the driver', schema: { type: 'integer' }}
			],
			responses: {
				200: {
					description: 'Information of driver with ID',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Driver' }
						}
					}
				},
				403: { description: 'Access Forbidden: Only admins or companies' },
				404: { description: 'Driver not found' },
			}
		},
	}
}