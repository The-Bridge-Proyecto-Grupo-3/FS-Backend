const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signToken = (subject,expiresIn,secret) => jwt.sign({}, secret, { subject: String(subject), expiresIn });
const verifyToken = (token,secret) => {
	if(!token) return { err: "Missing token" };
	try {
		return { payload: jwt.verify(token,secret) };
	} catch (error) {
		const err = (() => {
			switch(error.name) {
				case "TokenExpiredError":
				case "NotBeforeError":
					return "Token expired";
				case "JsonWebTokenError":
					return "Invalid token";
				default:
					return "Something went wrong";
			}
		})();
		return { err };
	}
};

module.exports = {
	signLogin: user => signToken(user.id,env.jwt.accessExpires,env.jwt.accessSecret),
	sign2FALogin: user => signToken(user.id,env.jwt.tempExpires,env.jwt.tempSecret),
	signEmailVerification: user => signToken(user.id,env.jwt.emailExpires,env.jwt.emailSecret),
	verifyLogin: token => verifyToken(token, env.jwt.accessSecret),
	verify2FALogin: token => verifyToken(token, env.jwt.tempSecret),
	verifyEmail: token => verifyToken(token, env.jwt.emailSecret),
}