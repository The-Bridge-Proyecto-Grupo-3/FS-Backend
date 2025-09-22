import { Router } from "express";
import User from "../../models/user.js";
import { env } from "../../config/env.js";
import { sendMail } from "../../config/nodemailer.js";
import { verifyEmail, signEmailVerification } from "../../utils/jwt.js";

const router = Router();

router.get("/", async (req,res) => {
	const { token } = req.query;
	if(!token) return res.status(400).send({ error: "Missing token"});
	const { payload, err } = verifyEmail(token);
	if(err) return res.status(401).send({ error: err });

	await User.update({ emailVerified: true, emailVerifiedAt: new Date()}, { where: { id: payload.sub, emailVerified: false }});
	return res.status(204).end();
});

router.post("/", async (req,res) => {
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