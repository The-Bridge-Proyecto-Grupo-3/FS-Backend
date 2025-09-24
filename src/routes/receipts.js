const { Router } = require("express");
const { authenticate, hasRole } = require("../middleware/authentication");
const { Receipt } = require("../models");

const router = Router();
router.use(authenticate);

router.post("/", hasRole('driver'), async (req,res) => {
	try {
		const { price, quantity, mileage } = req.body;
		const vehicle = await req.user.Driver.getVehicle();
		if(!vehicle) return res.status(409).send({ error: "Driver doesn't have a vehicle assigned" });
	
		const receipt = await Receipt.create({ price, quantity, mileage, driver_id: req.user.driver_id, vehicle_id: vehicle.id });
		return res.status(201).end();
	} catch(error) {
		console.error(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

module.exports = router;