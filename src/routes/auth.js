import { Router } from "express";
import User from "../models/user.js";
import Company from "../models/company.js";
import Driver from "../models/driver.js";
import Refuelling from "../models/refuelling.js";
import Vehicle from "../models/vehicle.js";
import bcrypt from "bcrypt";
import { signLogin, sign2FALogin } from "../utils/jwt.js";
import _2FARoutes from './2fa.js';
import verifyEmailRoutes from './verifyEmail.js';

const router = Router();
const DUMMY_PASSWORD = "$2a$12$VqZPYU.9rWU8KA06gqEpW.kFB5KgahB66gS/ejDdd94C6kGdyFRfe";

router.use('/2fa', _2FARoutes);
router.use('/verify', verifyEmailRoutes);

router.post("/login", async (req,res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ where: { email }});
	const passwordCorrect = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_PASSWORD);
	if(!passwordCorrect) return res.status(404).send({ error: "Wrong email or password" });
	if(!user.emailVerified) return res.status(401).send({ error: "Please verify your email" });

	const requires2FA = user.twoFactorEnabled;
	const token = requires2FA ? sign2FALogin(user):signLogin(user);
	return res.send({ requires2FA, token });
});

export default router;
