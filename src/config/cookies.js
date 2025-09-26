const env = require("./env");

module.exports = {
	setCookie: (res,name,value) => {
		res.cookie(name, value, {
			httpOnly: true,
			secure: env.cookie.secure,
			sameSite: env.cookie.sameSite,
			maxAge: env.cookie.age
		});
	}
}