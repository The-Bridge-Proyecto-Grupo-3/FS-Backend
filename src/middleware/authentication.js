const { User, Company, Driver, Vehicle } = require('../models');
const { verifyLogin } = require('../utils/jwt');

module.exports = {
	authenticate: async (req,res,next) => {
		try {
			const token = req.cookies.token;
			const { payload, err } = verifyLogin(token);
			if(err) return res.status(401).send({ error: err });
			// TODO validate tokens in the DB?
			req.user = await User.findByPk(payload.sub, {
				include: [
					Company,
					{ model:Driver, include:[Vehicle]}
				]
			});
			next();
		} catch (error) {
			console.log(error);
			return res.status(500).send({ error: "Internal Server Error" });
		}
	},
	hasRole: (...roles) => async (req,res,next) => {
		if(!req.user) return res.status(500).send({ error: "Internal Server Error: Missing authentication."});
		if(!roles.includes(req.user.role)) return res.status(403).send({ error: `Access Forbidden: Allowed roles: ${roles.join(', ')}`});
		next();
	},
	limitCompanyScope: (req) => {
		const role = req.user.role;
		if(role==="admin") return null;
		if(role==="company") return req.user.company_id;
		if(role==="driver") return req.user.Driver.company_id;
		throw new Error('Role not implemented');
	}
}