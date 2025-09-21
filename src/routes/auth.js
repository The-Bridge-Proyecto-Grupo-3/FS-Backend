import { Router } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { signLogin, sign2FALogin, verifyEmail, signEmailVerification } from "../utils/jwt.js";
import { env } from "../config/env.js";
import { sendMail } from "../config/nodemailer.js";
import _2FARoutes from './2fa.js';

const router = Router();
const DUMMY_PASSWORD = "$2a$12$VqZPYU.9rWU8KA06gqEpW.kFB5KgahB66gS/ejDdd94C6kGdyFRfe";

router.use('/2fa', _2FARoutes);

router.post("/login", async (req,res) => {
	const { email, firstName, password } = req.body;
	const user = await User.findOne({ where: { email }});
	const passswordCorrect = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_PASSWORD);
	if(!passswordCorrect) return res.status(404).send({ error: "Wrong email or password" });

	const requires2FA = user.twoFactorEnabled;
	const token = requires2FA ? sign2FALogin(user):signLogin(user);
	return res.send({ requires2FA, token });
});

router.get("/verify", async (req,res) => {
	const { token } = req.query;
	if(!token) return res.status(400).send({ error: "Missing token"});
	const { payload, err } = verifyEmail(token);
	if(err) return res.status(401).send({ error: err });

	await User.update({ emailVerified: true, emailVerifiedAt: new Date()}, { where: { id: payload.sub, emailVerified: false }});
	return res.status(204).end();
});

router.post("/verify", async (req,res) => {
	const { email } = req.body;
	const user = await User.findOne({ where: { email }});
	if(user && !user.emailVerified) {
		const token = signEmailVerification(user);
		const url = `${env.appBaseUrl}/auth/verify?token=${token}`
		sendMail({
			to: user.email,
			subject: "Confirm your email",
			text: `Confirm your email: ${url}`,
			html: `<p>Confirm your email here: <a href="${url}">${url}</a></p>`
		});
	}

	return res.status(204).end();
});

export default router;
