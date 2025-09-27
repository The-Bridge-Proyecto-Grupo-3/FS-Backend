const { Router } = require('express');
const { EVStation, Sequelize, Sequelize: { Op } } = require('../models');
const { BadRequestError } = require('../errors/httpErrors');

const router = Router();

router.get('/ev', async (req,res,next) => {
	let { radius = 20, lat, lon, limit = 100 } = req.query;
	limit = Math.min(limit,100);
	const Rearth = 6371;
	try {
		if(!lat || !lon) throw new BadRequestError('Introduce latitud y longitud');
		if(isNaN(+lat) || isNaN(+lon) || isNaN(+radius) || isNaN(+limit)) throw new BadRequestError('Consulta invalida');
		const stations = await EVStation.findAll({
			attributes: {
				include: [
					[Sequelize.literal(`SQRT(POW(radians(latitude-${lat})*${Rearth},2) + POW(RADIANS(longitude-${lon})*${Rearth}*COS(RADIANS((latitude+${lat})/2)),2))`), 'distance']
				]
			},
			order: [['distance','ASC']],
			having: {
				distance: {
					[Op.lte]: radius
				}
			},
			limit: +limit
		});
		return res.send(stations);
	} catch (error) {
		next(error);
	}
});

module.exports = router;