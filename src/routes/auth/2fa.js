const { Router } = require("express");
const { signLogin, verify2FALogin } = require("../../utils/jwt");
const { User } = require("../../models");
const { generate2FASecret, verifyTOTP } = require("../../utils/totp");
const { authenticate } = require("../../middleware/authentication");

const router = Router();

router.post('/', async (req,res) => {
	const { code } = req.body;
	const tempToken = req.headers.authorization;
	const { payload, err } = verify2FALogin(tempToken);
	if(err) return res.status(401).send({ error: err });

	const user = await User.findByPk(payload.sub);
	const valid = verifyTOTP(code, user.twoFactorSecret);
	if(!valid) return res.status(401).send({ error: 'Invalid TOTP'});

	const token = signLogin(user);

	return res.send({ token, user });
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
