const security = require('../security');

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
				201: { description: 'Receipt registered' },
				403: { description: 'Access Forbidden: only driver can create receipts' },
				409: { description: "Driver doesn't have a vehicle assigned" },
			}
		}
	}
}