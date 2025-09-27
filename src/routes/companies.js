const { Router } = require('express');
const { Company } = require('../models');
const bcrypt = require('bcrypt');
const env = require('../config/env');
const { sendMail } = require('../config/nodemailer');
const { signEmailVerification } = require('../utils/jwt');
const { limitCompanyScope, authenticate, hasRole } = require('../middleware/authentication');

const router = Router();

router.post('/', async (req,res,next) => {
	const { email, password, ...companyData } = req.body;
	const emailSent = env.mail.sendVerification;

	try {
		const company = await Company.create(companyData);

		const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
		const user = await company.createUser({ email, passwordHash, role: 'company', emailVerified: !emailSent });

		if(emailSent) {
			const token = signEmailVerification(user);
			const url = `${env.appBaseUrl}/auth/verify?token=${token}`;

			sendMail({
				to: email,
				subject: 'Correo de verificación',
				text: `Tu cuenta de empresa fue creada con éxito. Por favor confirme su correo haciendo click en el siguiente enlace: ${url}`,
				html: `Tu cuenta de empresa fue creada con éxito. Por favor confirme su correo haciendo click en el siguiente enlace: <a href="${url}">${url}</a>`,
			});
		}

		return res.status(201).send({ emailSent });
	} catch (error) {
		next(error);
	}
});

router.get('/', authenticate, hasRole('admin'), async (req,res,next) => {
	try {
		const companies = await Company.findAll();
		return res.send(companies);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', authenticate, hasRole('admin'), async (req,res,next) => {
	try {
		const { id } = req.params;
		const company = await Company.findByPk(id);
		return res.send(company);
	} catch (error) {
		next(error);
	}
});

module.exports = router;