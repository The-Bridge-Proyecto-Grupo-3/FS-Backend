const { Router } = require("express");
const { authenticate, hasRole, limitCompanyScope } = require("../middleware/authentication");
const { Receipt, Driver, Vehicle } = require("../models");

const router = Router();
router.use(authenticate);

router.post("/", hasRole('driver'), async (req,res) => {
	try {
		const vehicle = await req.user.Driver.getVehicle();
		if(!vehicle) return res.status(409).send({ error: "Driver doesn't have a vehicle assigned" });
	
		const receipt = await Receipt.create({ ...req.body, driver_id: req.user.driver_id, vehicle_id: vehicle.id });
		return res.status(201).end();
	} catch(error) {
		console.error(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

router.get("/", hasRole("admin","company"), async (req,res) => {
	const companyId = limitCompanyScope(req) ?? req.query.companyId;
	const where = {
		...(companyId ? { company_id: companyId }:{})
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
		console.error(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
})

module.exports = router;