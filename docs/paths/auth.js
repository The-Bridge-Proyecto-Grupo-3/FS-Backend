const security = require('../security');

const contentError = {
	'application/json': { 
		schema: { $ref: '#/components/schemas/Error' }
	}
};

module.exports = {
	'/auth/login': {
		post: {
			tags: ['Auth'],
			summary: 'Login',
			description: 'Login endpoint. The response object contains a token and whether or not a 2FA code is needed. If the 2FA is not needed, it also returns the user object with info about the company or the driver',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/Login' }
					}
				}
			},
			responses: {
				200: {
					description: 'Login successful',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/LoginResponse' }
						}
					}
				},
				401: {
					description: 'Unauthorized: Email not verified',
					content: contentError
				},
				404: {
					description: 'Wrong credentials',
					content: contentError
				}
			}
		}
	},
	'/auth/2fa/enable': {
		get: {
			tags: ['Auth'],
			summary: 'Get TOTP secret to enable 2FA',
			security: security.jwt,
			responses: {
				200: {
					description: 'Registered vehicle',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Enable2FAResponse' }
						}
					}
				},
				401: {
					description: 'Unauthorized',
					content: contentError
				},
				409: {
					description: 'Already enabled',
					content: contentError
				},
			}
		},
		post: {
			tags: ['Auth'],
			summary: 'Send 2FA code to enable it',
			security: security.jwt,
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/Enable2FA' }
					}
				}
			},
			responses: {
				204: {
					description: '2FA enabled'
				},
				401: {
					description: 'Invalid token, expired or wrong code',
					content: contentError
				},
				409: {
					description: '2FA already enabled',
					content: contentError
				}
			}
		},
	},
	'/auth/verify': {
		get: {
			tags: ['Auth'],
			summary: 'Verify email',
			parameters: [
				{ name: 'token', in: 'query', required: true, description: 'Verification token', schema: { type: 'string' }}
			],
			responses: {
				204: {
					description: 'Email successfully verified',
					content: {
						'application/json': { 
							schema: { $ref: '#/components/schemas/Vehicle' }
						}
					}
				},
				400: {
					description: 'Missing token',
					content: contentError
				},
				401: {
					description: 'Unauthorized',
					content: contentError
				}
			}
		},
		post: {
			tags: ['Auth'],
			summary: 'Resend verification email',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['email'],
							properties: {
								email: { type: 'string' }
							}
						}
					}
				}
			},
			responses: {
				204: {
					description: 'Email sent or not found in DB'
				}
			}
		}
	}
}