module.exports = {
	Vehicle: {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			company_id: { type: 'integer' },
			brand: { type: 'string' },
			model: { type: 'string' },
			license_plate: { type: 'string' },
			type: { type: 'string', enum: ['gas', 'electric'] },
			registration_date: { type: 'string', format: 'date-time' },
			in_use_by: { type: 'integer', nullable: true }
		}
	},
	VehicleInput: {
		type: 'object',
		required: ['brand', 'model', 'license_plate', 'type', 'registration_date'],
		properties: {
			brand: { type: 'string' },
			model: { type: 'string' },
			license_plate: { type: 'string' },
			type: { type: 'string', enum: ['gas', 'electric'] },
			registration_date: { type: 'string', format: 'date-time' }
		}
	},
	Login: {
		type: 'object',
		required: ['email', 'password'],
		properties: {
			email: { type: 'string' },
			password: { type: 'string' },
		}
	},
	VehicleUpdate: {
		allOf: [
			{ $ref: '#/components/schemas/VehicleInput'},
			{ required: [] }
		]
	},
	LoginResponse: {
		type: 'object',
		properties: {
			requires2FA: { type: 'boolean' },
			token: { type: 'string' },
			user: {
				type: 'object',
				nullable: true,
				anyOf: [
					{ $ref: '#/components/schemas/Company'},
					{ $ref: '#/components/schemas/Driver'},
				]
			},
		}
	},
	Enable2FA: {
		type: 'object',
		required: ['code'],
		properties: {
			code: { type: 'string' },
		}
	},
	Enable2FAResponse: {
		type: 'object',
		properties: {
			secret: { type: 'string' },
			qrDataURL: { type: 'string' }
		}
	},
	Error: {
		type: 'object',
		properties: {
			error: { type: 'string' }
		}
	}
}