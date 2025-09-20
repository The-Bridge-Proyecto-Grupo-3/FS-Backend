import "dotenv/config";

export const env = {
	nodeEnv: process.env.NODE_ENV ?? "development",
	port: Number(process.env.PORT ?? 4000),
	db: {
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT ?? 3306),
		name: process.env.DB_NAME,
		user: process.env.DB_USER,
		pass: process.env.DB_PASS,
		logging: process.env.DB_LOGGING == "true",
	},
	jwt: {
		accessSecret: process.env.JWT_ACCESS_SECRET,
		tempSecret: process.env.JWT_TEMP_SECRET,
		emailSecret: process.env.EMAIL_TOKEN_SECRET,
		accessExpires: process.env.JWT_TOKEN_EXPIRES ?? "1d",
		tempExpires: process.env.JWT_TEMP_EXPIRES ?? "5m",
		emailExpires: process.env.EMAIL_TOKEN_EXPIRES,
	},
	bcryptRounds: process.env.BCRYPT_ROUNDS ?? 12,
	corsOrigin: process.env.CORS_ORIGIN,
	appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:4000",
	smtp: {
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT ?? 587),
		secure: process.env.SMTP_SECURE === "true",
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
	mail: {
		from: process.env.MAIL_FROM ?? "no-reply@example.com",
		logging: process.env.NODEMAILER_LOGGING === "true",
	},
};
