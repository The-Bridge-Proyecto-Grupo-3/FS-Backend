const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

module.exports = {
	generate2FASecret: async (email, issuer = "App") => {
		const { base32: secret, otpauth_url } = speakeasy.generateSecret({
			length: 20,
			name: `${issuer}:${email}`,
			issuer
		});
		const qrDataURL = await qrcode.toDataURL(otpauth_url, { errorCorrectionLevel: 'L' });
		return { secret, qrDataURL };
	},

	verifyTOTP: (code, secret) => speakeasy.totp.verify({
		secret,
		encoding: "base32",
		token: code,
		window: 1
	})
};