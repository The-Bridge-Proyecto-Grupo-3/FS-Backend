import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

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

export const signLogin = user => signToken(user.id,env.jwt.accessExpires,env.jwt.accessSecret);
export const sign2FALogin = user => signToken(user.id,env.jwt.tempExpires,env.jwt.tempSecret);
export const signEmailVerification = user => signToken(user.id,env.jwt.emailExpires,env.jwt.emailSecret);

export const verifyLogin = token => verifyToken(token, env.jwt.accessSecret);
export const verify2FALogin = token => verifyToken(token, env.jwt.tempSecret);
export const verifyEmail = token => verifyToken(token, env.jwt.emailSecret);