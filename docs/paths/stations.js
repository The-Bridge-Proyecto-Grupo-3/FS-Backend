const security = require('../security');

module.exports = {
	'/stations/ev': {
		get: {
			tags: ['Stations'],
			summary: 'Get all receipts',
			security: security.jwt,
			parameters: [
				{ name: 'lat', in: 'query', required: true, description: 'Latitude', schema: { type: 'number' }},
				{ name: 'lon', in: 'query', required: true, description: 'Longitude', schema: { type: 'number' }},
				{ name: 'radius', in: 'query', required: false, description: 'Radius in kilometers', schema: { type: 'number', default: 20 }},
				{ name: 'limit', in: 'query', required: false, description: 'Max number of stations', schema: { type: 'integer', default: 100 }}
			],
			responses: {
				200: {
					description: 'List of all EV charging stations in a certain radius',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/EVStation' }
						}
					}
				},
			}
		},
	},
	// '/stations/gas': {
	// 	get: {
	// 		tags: ['Stations'],
	// 		summary: 'Get all receipts',
	// 		security: security.jwt,
	// 		parameters: [
	// 			{ name: 'lat', in: 'query', required: true, description: 'Latitude', schema: { type: 'number' }},
	// 			{ name: 'lon', in: 'query', required: true, description: 'Longitude', schema: { type: 'number' }},
	// 			{ name: 'radius', in: 'query', required: false, description: 'Radius in kilometers', schema: { type: 'number', default: 20 }},
	// 			{ name: 'limit', in: 'query', required: false, description: 'Max number of stations', schema: { type: 'integer', default: 100 }}
	// 		],
	// 		responses: {
	// 			200: { description: 'List of all gas stations in a certain radius' },
	// 		}
	// 	},
	// }
}