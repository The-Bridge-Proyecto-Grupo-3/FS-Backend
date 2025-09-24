const env = require('../src/config/env');
const schemas = require('./components/schemas');

module.exports = {
	openapi: '3.0.0',
	info: {
		title: 'API recomendación gasolineras',
		version: '0.1.0',
		description: 'Documentación de la API para administración de empresas, conductores y vehículos'
	},
	servers: [
		{ url: env.appBaseUrl }
	],
	tags: [
		{ name: 'Auth' },
		{ name: 'Companies' },
		{ name: 'Drivers' },
		{ name: 'Receipts' },
		{ name: 'Vehicles' },
	],
	paths: {
		...require('./paths/auth'),
		...require('./paths/drivers'),
		...require('./paths/companies'),
		...require('./paths/receipts'),
		...require('./paths/vehicles'),
	},
	components: {
		schemas,
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		}
	}
}