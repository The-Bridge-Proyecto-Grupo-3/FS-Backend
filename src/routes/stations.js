const { Router } = require('express');
const { EVStation, Sequelize, Sequelize: { Op } } = require('../models');

const router = Router();

router.get('/ev', async (req,res) => {
	let { radius = 20, lat, lon, limit = 100 } = req.query;
	limit = Math.min(limit,100);
	const Rearth = 6371;
	try {
		console.log(lat,lon,isNaN(+lat),isNaN(+lon));
		if(isNaN(+lat) || isNaN(+lon) || isNaN(+radius)) return res.status(400).send({ error: 'Invalid query'});
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
		console.error(error);
		return res.status(500).send({ error: 'Internal Server Error' });
	}
});

module.exports = router;