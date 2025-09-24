const security = require('../security');

const driverIdSchema = {
	type: 'object',
	properties: {
		driverId: {
			type: 'integer',
			description: 'Driver ID to assign the vehicle to. Only needed if user is not a driver'
		}
	}
};

const contentError = {
	'application/json': { 
		schema: { $ref: '#/components/schemas/Error' }
	}
};

module.exports = {
	'/receipts': {
		post: {
			tags: ['Receipts'],
			summary: 'Register a new receipt',
			security: security.jwt,
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/ReceiptInput' }
					}
				}
			},
			responses: {
				201: {
					description: 'Receipt registered'
				},
				403: {
					description: 'Access Forbidden: only driver can create receipts',
					content: contentError
				},
				409: {
					description: "Driver doesn't have a vehicle assigned",
					content: contentError
				},
			}
		}
	}
}