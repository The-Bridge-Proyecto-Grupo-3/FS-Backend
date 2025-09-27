const { HttpError } = require('../errors/httpErrors');

const errorHandler = (err,req,res,next) => {
	console.error(err);
	if (
		err.name === 'SequelizeValidationError' ||
		err.name === 'SequelizeUniqueConstraintError'
	) {
		res.status(400).send({ error: err.errors.map(e => e.message).join('. ') });
	} else if(err instanceof HttpError) {
		res.status(err.status).send({ error: err.message })
	} else {
		res.status(500).send({ error: 'Internal Server Error' })
	}
}

module.exports = errorHandler;