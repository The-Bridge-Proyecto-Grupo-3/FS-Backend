const { Router } = require("express");
const { User, Driver, Company } = require("../../models");
const bcrypt = require("bcrypt");
const { signLogin, sign2FALogin } = require("../../utils/jwt");

const router = Router();
const DUMMY_PASSWORD = "$2a$12$VqZPYU.9rWU8KA06gqEpW.kFB5KgahB66gS/ejDdd94C6kGdyFRfe";

router.use('/2fa', require("./2fa"));
router.use('/verify', require("./verifyEmail"));

router.post("/login", async (req,res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ where: { email }, include: [Driver, Company]});
	const passwordCorrect = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_PASSWORD);
	if(!passwordCorrect | !user) return res.status(404).send({ error: "Wrong email or password" });
	if(!user.emailVerified) return res.status(401).send({ error: "Please verify your email" });

	const requires2FA = user.twoFactorEnabled;
	const token = requires2FA ? sign2FALogin(user):signLogin(user);

	const userResult = {
		role: user.role,
		...user.Driver?.toJSON(),
		...user.Company?.toJSON(),
	};

	return res.send({ requires2FA, token, user: userResult });
});

module.exports = router;
