const { Router } = require("express");
const { signLogin, verify2FALogin } = require("../../utils/jwt");
const { User, Driver, Company } = require("../../models");
const { generate2FASecret, verifyTOTP } = require("../../utils/totp");
const { authenticate } = require("../../middleware/authentication");
const rateLimit = require("../../utils/rateLimit");
const { setCookie } = require("../../config/cookies");

const router = Router();

router.post('/', rateLimit(60,5), async (req,res) => {
	const { code } = req.body;
	// const tempToken = req.headers.authorization;
	console.log(req.cookies)
	const tempToken = req.cookies.token;
	const { payload, err } = verify2FALogin(tempToken);
	if(err) return res.status(401).send({ error: err });
	
	const user = await User.findByPk(payload.sub, { include: [Driver,Company] });
	console.log(code,user.twoFactorSecret);
	const valid = verifyTOTP(code, user.twoFactorSecret);
	if(!valid) return res.status(401).send({ error: 'Invalid TOTP'});

	const token = signLogin(user);
	setCookie(res,'token',token);

	const userResult = { ...user.Driver?.toJSON(), ...user.Company?.toJSON() };

	return res.send({ token, role: user.role, user: userResult });
});

router.get('/enable', authenticate, async (req,res) => {
	const user = req.user;
	if(user.twoFactorEnabled) return res.status(409).send({ error: "2FA already enabled"});
	const { secret, qrDataURL } = await generate2FASecret(user.email);
	user.twoFactorSecret = secret;
	user.twoFactorGeneratedAt = new Date();
	await user.save();
	return res.send({ qrDataURL, secret });
});

router.post('/enable', authenticate, async (req,res) => {
	const user = req.user;
	if(user.twoFactorEnabled) return res.status(409).send({ error: "2FA already enabled"});
	
	if(new Date() - user.twoFactorGeneratedAt >= 300000) { // 5 min time limit
		user.twoFactorGeneratedAt = null;
		user.twoFactorSecret = null;
		await user.save(); // optional
		return res.status(401).send({ error: 'Time expired' });
	}
	
	const { code } = req.body;
	const valid = verifyTOTP(code, user.twoFactorSecret);
	if(!valid) return res.status(401).send({ error: 'Invalid TOTP'});

	user.twoFactorEnabled = true;
	await user.save();
	return res.status(204).end();
});

module.exports = router;
