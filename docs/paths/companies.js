const security = require('../security');

module.exports = {
	'/companies': {
		get: {
			tags: ['Companies'],
			summary: 'Lists all companies',
			security: security.jwt,
			responses: {
				200: {
					description: 'List all companies',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: { $ref: '#/components/schemas/Company' }
							}
						}
					}
				},
				403: { description: 'Access forbidden. Only admins' }
			}
		},
		post: {
			tags: ['Companies'],
			summary: 'Register a company',
			security: security.jwt,
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/CompanyInput' }
					}
				}
			},
			responses: {
				201: { description: 'Registered company' }
			}
		}
	},
	'/companies/{id}': {
		get: {
			tags: ['Companies'],
			summary: 'Get a company by ID',
			security: security.jwt,
			parameters: [
				{ name: 'id', in: 'path', required: true, description: 'ID of the company', schema: { type: 'integer' }}
			],
			responses: {
				200: {
					description: 'Information of company with ID',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Company' }
						}
					}
				},
				403: { description: 'Access Forbidden: Only admins' },
				404: { description: 'Company not found' },
			}
		},
	}
}