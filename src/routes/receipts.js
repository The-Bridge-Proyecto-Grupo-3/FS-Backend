const { Router } = require("express");
const { authenticate, hasRole, limitCompanyScope } = require("../middleware/authentication");
const { Receipt, Driver, Vehicle } = require("../models");
const { ConflictError } = require('../errors/httpErrors');

const router = Router();
router.use(authenticate);

router.post("/", hasRole('driver'), async (req,res,next) => {
	try {
		const vehicle = await req.user.Driver.getVehicle();
		if(!vehicle) throw new ConflictError("Driver doesn't have a vehicle assigned");
	
		await Receipt.create({ ...req.body, driver_id: req.user.driver_id, vehicle_id: vehicle.id });
		return res.status(201).end();
	} catch(error) {
		next(error);
	}
});

router.get("/", hasRole("admin","company"), async (req,res,next) => {
	const company_id = limitCompanyScope(req) ?? req.query.company_id;
	const where = {
		...(company_id ? { company_id }:{})
	};
	try {
		const receipts = await Receipt.findAll({
			attributes: { exclude: ['driver_id','vehicle_id'] },
			include: [
				{ model: Driver, where },
				Vehicle
			]
		});
		return res.send(receipts);
	} catch (error) {
		next(error);
	}
})

module.exports = router;