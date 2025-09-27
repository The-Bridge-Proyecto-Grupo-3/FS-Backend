class HttpError extends Error {
	constructor(message, status = 500) {
		super(message);
		this.status = status;
	}
}

const createHttpError = (error,status) => {
	return class extends HttpError {
		constructor(message) {
			super(message, status);
			this.name = error+"Error";
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

const errors = [
	["BadRequest",400],
	["Unauthorized",401],
	["Forbidden",403],
	["NotFound",404],
	["Conflict",409],
	["InternalServer",500]
]

module.exports = {
	...Object.fromEntries(errors.map(error => [error[0]+"Error", createHttpError(...error)] )),
	HttpError
}