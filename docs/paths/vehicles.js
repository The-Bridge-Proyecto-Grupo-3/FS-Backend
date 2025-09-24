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
	'/vehicles': {
		get: {
			tags: ['Vehicles'],
			summary: 'Lists all vehicles',
			security: security.jwt,
			parameters: [
				{ name: 'available', in: 'query', required: false, description: 'Filter unused vehicles', schema: { type: 'boolean' }}
			],
			responses: {
				200: {
					description: 'List all vehicles',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: { $ref: '#/components/schemas/Vehicle' }
							}
						}
					}
				}
			}
		},
		post: {
			tags: ['Vehicles'],
			summary: 'Register a vehicle',
			security: security.jwt,
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/VehicleInput' }
					}
				}
			},
			responses: {
				201: {
					description: 'Registered vehicle',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Vehicle' }
						}
					}
				},
				403: {
					description: 'Access Forbidden: driver cannot create vehicles',
					content: contentError
				},
			}
		}
	},
	'/vehicles/{id}': {
		get: {
			tags: ['Vehicles'],
			summary: 'Get a vehicle by ID',
			security: security.jwt,
			parameters: [
				{ name: 'id', in: 'path', required: true, description: 'ID of the vehicle', schema: { type: 'integer' }}
			],
			responses: {
				200: {
					description: 'Information of vehicle with ID',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Vehicle' }
						}
					}
				},
				404: {
					description: 'Vehicle not found',
					content: contentError
				},
			}
		},
		put: {
			tags: ['Vehicles'],
			summary: 'Modify a vehicle',
			security: security.jwt,
			parameters: [
				{ name: 'id', in: 'path', required: true, description: 'ID of the vehicle', schema: { type: 'integer' }}
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/VehicleUpdate' }
					}
				}
			},
			responses: {
				200: {
					description: 'Registered vehicle',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Vehicle' }
						}
					}
				},
				403: {
					description: 'Access Forbidden: driver cannot modify vehicles',
					content: contentError
				},
				404: {
					description: 'Vehicle not found',
					content: contentError
				},
			}
		},
		delete: {
			tags: ['Vehicles'],
			summary: 'Delete a vehicle',
			security: security.jwt,
			parameters: [
				{ name: 'id', in: 'path', required: true, description: 'ID of the vehicle', schema: { type: 'integer' }}
			],
			responses: {
				200: {
					description: 'Registered vehicle',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Vehicle' }
						}
					}
				},
				403: {
					description: 'Access Forbidden: driver cannot delete vehicles',
					content: contentError
				},
				404: {
					description: 'Vehicle not found',
					content: contentError
				},
			}
		}
	},
	'/vehicles/{id}/assign': {
		put: {
			tags: ['Vehicles'],
			summary: 'Assign a vehicle to a driver',
			security: security.jwt,
			parameters: [
				{ name: 'id', in: 'path', required: true, description: 'ID of the vehicle', schema: { type: 'integer' }}
			],
			requestBody: {
				required: false,
				content: {
					'application/json': {
						schema: driverIdSchema
					}
				}
			},
			responses: {
				201: {
					description: 'Vehicle assigned succesfully',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Vehicle' }
						}
					}
				},
				400: {
					description: 'Missing driverId',
					content: contentError
				},
				404: {
					description: 'Vehicle not found',
					content: contentError
				},
				409: {
					description: 'Vehicle already assigned or driver has another vehicle',
					content: contentError
				},
			}
		},
		delete: {
			tags: ['Vehicles'],
			summary: 'Remove driver from vehicle',
			security: security.jwt,
			parameters: [
				{ name: 'id', in: 'path', required: true, description: 'ID of the vehicle', schema: { type: 'integer' }}
			],
			responses: {
				200: {
					description: 'Registered vehicle',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Vehicle' }
						}
					}
				},
				403: {
					description: 'Access Forbidden: driver cannot remove other drivers from vehicles',
					content: contentError
				},
				404: {
					description: 'Vehicle not found',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Error' }
						}
					}
				},
			}
		}
	}
}