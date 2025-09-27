const { User, Company, Driver, Vehicle } = require('../models');
const { verifyLogin } = require('../utils/jwt');
const { UnauthorizedError, ForbiddenError, InternalSeverError } = require('../errors/httpErrors');

module.exports = {
	authenticate: async (req,res,next) => {
		try {
			const token = req.cookies.token;
			const { payload, err } = verifyLogin(token);
			if(err) throw new UnauthorizedError(err);
			// TODO validate tokens in the DB?
			req.user = await User.findByPk(payload.sub, {
				include: [
					Company,
					{ model:Driver, include:[Vehicle]}
				]
			});
			next();
		} catch (error) {
			next(error);
		}
	},
	hasRole: (...roles) => async (req,res,next) => {
		if(!req.user) next(new InternalSeverError("Falta autenticación."));
		if(!roles.includes(req.user.role)) next(new ForbiddenError(`Roles permitidos: ${roles.join(', ')}`));
		next();
	},
	limitCompanyScope: (req) => {
		const role = req.user.role;
		if(role==="admin") return null;
		if(role==="company") return req.user.company_id;
		if(role==="driver") return req.user.Driver.company_id;
		throw new InternalSeverError('Role not implemented');
	}
}