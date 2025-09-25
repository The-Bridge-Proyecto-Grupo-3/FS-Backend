const rateLimit = require("express-rate-limit");

module.exports = (windowSeconds, max) => rateLimit({
	windowMs: windowSeconds*1000,
	max,
	skipSuccessfulRequests: true,
	requestWasSuccessful: (req,res) => res.statusCode < 400 || res.statusCode === 429,
	handler: (req,res) => {
		res.status(429).send({ error: "Too many requests" });
	}
});