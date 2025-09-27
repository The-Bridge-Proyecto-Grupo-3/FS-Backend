const { Router } = require("express");
const { signLogin, verify2FALogin } = require("../../utils/jwt");
const { User, Driver, Company, Vehicle } = require("../../models");
const { generate2FASecret, verifyTOTP } = require("../../utils/totp");
const { authenticate } = require("../../middleware/authentication");
const rateLimit = require("../../utils/rateLimit");
const { setCookie } = require("../../config/cookies");
const { UnauthorizedError, ConflictError } = require('../../errors/httpErrors');

const router = Router();

router.post('/', rateLimit(60,5), async (req,res,next) => {
	try {
		const { code } = req.body;
		const tempToken = req.cookies.token;
		const { payload, err } = verify2FALogin(tempToken);
		if(err) throw new UnauthorizedError(err);
		
		const user = await User.findByPk(payload.sub, {
			include: [
				{
					model: Driver,
					include: [Vehicle]
				},
				Company
			]
		});
		const valid = verifyTOTP(code, user.twoFactorSecret);
		if(!valid) throw new UnauthorizedError('Código TOTP inválido');
	
		const token = signLogin(user);
		setCookie(res,'token',token);
		const userResult = { ...user.Driver?.toJSON(), ...user.Company?.toJSON() };
		return res.send({ role: user.role, user: userResult });
	} catch (error) {
		next(error);
	}
});

router.get('/enable', authenticate, async (req,res,next) => {
	try {
		const user = req.user;
		if(user.twoFactorEnabled) throw new ConflictError("2FA ya está activo");
		const { secret, qrDataURL } = await generate2FASecret(user.email);
		user.twoFactorSecret = secret;
		user.twoFactorGeneratedAt = new Date();
		await user.save();
		return res.send({ qrDataURL, secret });
	} catch (error) {
		next(error);
	}
});

router.post('/enable', authenticate, async (req,res,next) => {
	try {
		const user = req.user;
		if(user.twoFactorEnabled) throw new ConflictError("2FA ya está activo");
		
		if(new Date() - user.twoFactorGeneratedAt >= 300000) { // 5 min time limit
			user.twoFactorGeneratedAt = null;
			user.twoFactorSecret = null;
			await user.save(); // optional
			throw new UnauthorizedError('Tiempo expirado');
		}
		
		const { code } = req.body;
		const valid = verifyTOTP(code, user.twoFactorSecret);
		if(!valid) throw new UnauthorizedError('Código TOTP inválido');
	
		user.twoFactorEnabled = true;
		await user.save();
		return res.status(204).end();
	} catch (error) {
		next(error);
	}
});

module.exports = router;
