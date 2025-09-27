const { Router } = require("express");
const { User } = require("../../models");
const { env } = require("../../config/env");
const { sendMail } = require("../../config/nodemailer");
const { verifyEmail, signEmailVerification } = require("../../utils/jwt");
const rateLimit = require("../../utils/rateLimit");
const { BadRequestError, UnauthorizedError, ConflictError } = require('../../errors/httpErrors');

const router = Router();
router.use(rateLimit(3600,5));

router.get("/", async (req,res,next) => {
	try {
		const { token } = req.query;
		if(!token) throw new BadRequestError("Missing token");
		const { payload, err } = verifyEmail(token);
		if(err) throw new UnauthorizedError(err);
	
		await User.update({ emailVerified: true, emailVerifiedAt: new Date()}, { where: { id: payload.sub, emailVerified: false }});
		return res.status(204).end();
	} catch (error) {
		next(error);
	}
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

module.exports = router;