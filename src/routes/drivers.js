const { Router } = require('express');
const { Driver } = require('../models');
const bcrypt = require('bcrypt');
const env = require('../config/env');
const { sendMail } = require('../config/nodemailer');
const { signEmailVerification } = require('../utils/jwt');
const { hasRole, authenticate } = require('../middleware/authentication');

const router = Router();

router.post('/', authenticate, hasRole('company'), async (req,res) => {
	const { email, password, ...driverData } = req.body;
	const emailSent = env.mail.sendVerification;

	try {
		const driver = await Driver.create({ ...driverData, company_id: req.user.company_id });

		const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
		const user = await driver.createUser({ email, passwordHash, role: 'driver', emailVerified: !emailSent });

		if(emailSent) {
			const token = signEmailVerification(user);
			const url = `${env.appBaseUrl}/auth/verify?token=${token}`;

			sendMail({
				to: email,
				subject: 'Correo de verificación',
				text: `Tu cuenta de conductor fue creada con éxito. Por favor confirme su correo haciendo click en el siguiente enlace: ${url}`,
				html: `Tu cuenta de conductor fue creada con éxito. Por favor confirme su correo haciendo click en el siguiente enlace: <a href="${url}">${url}</a>`,
			});
		}

		return res.status(201).send({ emailSent });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ error: 'Internal Server Error' });
	}
});

module.exports = router;