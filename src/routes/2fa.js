import { Router } from "express";
import { signLogin, verify2FALogin } from "../utils/jwt";
import { User } from "../models/user";
import { generate2FASecret, verifyTOTP } from "../utils/totp";

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
	return res.send({ token });
});

router.get('/enable', authenticate, async (req,res) => {
	const user = req.user;
	if(user.twoFactorEnabled) return res.status(409).send({ error: "2FA already enabled"});
	const { secret, qrDataURL } = generate2FASecret(user.email);
	user.twoFactorSecret = secret;
	await user.save();
	return res.send({ qrDataURL, secret });
});

router.post('/enable', authenticate, async (req,res) => {
	const user = req.user;
	if(user.twoFactorEnabled) return res.status(409).send({ error: "2FA already enabled"});
	
	const valid = verifyTOTP(code, user.twoFactorSecret);
	if(!valid) return res.status(401).send({ error: 'Invalid TOTP'});
	user.twoFactorEnabled = true;
	await user.save();
	return res.send({ token });
});

export default router;
