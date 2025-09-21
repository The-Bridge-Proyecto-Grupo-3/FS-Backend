import { User } from '../models/user';
import { verifyLogin } from '../utils/jwt';

export const authenticate = async (req,res,next) => {
	try {
		const token = req.headers.authorization;
		const { payload, err } = verifyLogin(token);
		if(err) return res.status(401).send({ error: err });
		// TODO validate tokens in the DB?
		req.user = await User.findByPk(payload.sub);
		next();
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" });
	}
}