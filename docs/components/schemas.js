const credentials = {
	email: { type: 'string' },
	password: { type: 'string' },
};

const company = {
	name: { type: 'string' },
	CIF: { type: 'string' },
	postal_code: { type: 'integer' },
	address: { type: 'string' },
	state: { type: 'string' },
	payment_entity: { type: 'string' }
};

const vehicle = {
	brand: { type: 'string' },
	model: { type: 'string' },
	license_plate: { type: 'string' },
	type: { type: 'string', enum: ['gas', 'electric'] },
	registration_date: { type: 'string', format: 'date-time' }
};

const driver = {
	first_name: { type: 'string' },
	last_name: { type: 'string' }
};

const receipt = {
	quantity: { type: 'number' },
	price: { type: 'integer' },
	mileage: { type: 'integer' },
	fuel_type: { type: 'string', enum: ['95','98','glp','diesel','electric'] }
};

module.exports = {
	Vehicle: {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			company_id: { type: 'integer' },
			...vehicle,
			in_use_by: { type: 'integer', nullable: true }
		}
	},
	VehicleInput: {
		type: 'object',
		required: Object.keys(vehicle),
		properties: {
			...vehicle
		}
	},
	VehicleUpdate: {
		type: 'object',
		properties: {
			...vehicle
		}
	},
	Login: {
		type: 'object',
		required: ['email', 'password'],
		properties: {
			...credentials
		}
	},
	LoginResponse: {
		type: 'object',
		properties: {
			requires2FA: { 
				type: 'boolean',
				required: false
			},
			role: { type: 'string', enum: ['admin','company','driver']},
			user: {
				type: 'object',
				nullable: true,
				oneOf: [
					{ $ref: '#/components/schemas/Driver'},
					{ $ref: '#/components/schemas/Company'},
				]
			},
		}
	},
	CompanyInput: {
		type: 'object',
		required: Object.keys({...company,...credentials}),
		properties: {
			...credentials,
			...company
		}
	},
	Company: {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			...company,
			subscription_active: { type: 'boolean' }
		}
	},
	DriverInput: {
		type: 'object',
		required: Object.keys({...driver,...credentials}),
		properties: {
			...credentials,
			...driver
		}
	},
	Driver: {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			company_id: { type: 'integer' },
			...driver,
			Vehicle: {
				type: 'object',
				nullable: true,
				$ref: '#/components/schemas/Vehicle'
			}
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
	ReceiptInput: {
		type: 'object',
		required: Object.keys(receipt),
		properties: {
			...receipt
		}
	},
	Error: {
		type: 'object',
		properties: {
			error: { type: 'string' }
		}
	}
}