const security = require('../security');

module.exports = {
	'/receipts': {
		get: {
			tags: ['Receipts'],
			summary: 'Get all receipts',
			security: security.jwt,
			parameters: [
				{ name: 'companyId', in: 'query', required: false, description: 'Company ID (only for admins)', schema: { type: 'integer' }}
			],
			responses: {
				200: {
					description: 'List of all receipts'
				},
				403: {
					description: 'Access Forbidden: only company can access receipts',
					content: contentError
				}
			}
		},
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