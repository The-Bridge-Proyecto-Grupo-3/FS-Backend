import speakeasy from "speakeasy";
import qrcode from "qrcode";

export const generate2FASecret = (email, issuer = "App") => {
	const { base32: secret, otpauth_url } = speakeasy.generateSecret({
		length: 20,
		name: `${issuer}:${email}`,
		issuer
	});
	const qrDataURL = qrcode.toDataURL(otpauth_url);
	return { secret, qrDataURL };
}

export const verifyTOTP = (code, secret) => speakeasy.totp.verify({
	secret,
	encoding: "base32",
	token: code,
	window: 1
});