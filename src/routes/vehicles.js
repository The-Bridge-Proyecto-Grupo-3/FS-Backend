const { Router } = require("express");
const { authenticate, hasRole, limitCompanyScope } = require("../middleware/authentication");
const { Vehicle, Driver, Sequelize: { Op } } = require("../models");

const router = Router();

router.use(authenticate);

router.post("/", hasRole("admin","company"), async (req,res) => {
	try {
		const companyId = limitCompanyScope(req);
		const vehicle = await Vehicle.create({ ...req.body, company_id: companyId ?? req.body.companyId, in_use_by: null });
		return res.status(201).send(vehicle);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

router.put("/:id", hasRole("admin","company"), async (req,res) => {
	const { id } = req.params;
	try {
		const companyId = limitCompanyScope(req);
		const [found] = await Vehicle.update(req.body, {
			where : {
				id,
				...(companyId ? { company_id: companyId }:{})
			},
			fields: ['brand','model','license_plate','registration_date','type']
		});
		if(!found) return res.status(404).send({ error: "Vehicle not found" });

		const vehicle = await Vehicle.findByPk(id);
		return res.status(200).send(vehicle);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

router.delete("/:id", hasRole("admin","company"), async (req,res) => {
	const { id } = req.params;
	try {
		const companyId = limitCompanyScope(req);
		const found = await Vehicle.destroy({
			where : {
				id,
				...(companyId ? { company_id: companyId }:{})
			}
		});
		if(!found) return res.status(404).send({ error: "Vehicle not found" });

		return res.status(204).end();
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

router.get("/", async (req,res) => {
	const { available } = req.query; // return only unused vehicles
	const companyId = limitCompanyScope(req);
	try {
		const vehicles = await Vehicle.findAll({ where: {
			company_id: companyId, 
			...(available === "true" ? {
				in_use_by: {
					[Op.is]: null
				}
			}:{})
		}});
		return res.status(200).send(vehicles);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

router.get("/:id", async (req,res) => {
	const { id } = req.params;
	const companyId = limitCompanyScope(req);
	try {
		const vehicle = await Vehicle.findOne({ where: { id, company_id: companyId }});
		if(!vehicle) return res.status(404).send({ error: 'Vehicle not found' });
		return res.status(200).send(vehicle);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

router.put("/:id/assign", async (req,res) => {
	const { id } = req.params;
	const companyId = limitCompanyScope(req);
	const where = companyId ? { company_id: companyId }:{}
	try {
		let driver = req.user.Driver;
		if(!driver) {
			if(!req.body.driverId) return res.status(400).send({ error: "Missing driverId" });
			driver = await Driver.findOne({ where: {id: req.body.driverId, ...where} });
		}
		if(!driver) return res.status(404).send({ error: "Driver not found" });

		let vehicle = await driver.getVehicle();
		if(vehicle) {
			if(driver.id !== vehicle.in_use_by) return res.status(409).send({ error: "Driver already has a vehicle" });
			return res.status(200).send(vehicle);
		}

		vehicle = await Vehicle.findOne({ where: {id, ...where} });
		if(!vehicle) return res.status(404).send({ error: "Vehicle not found" });
		if(vehicle.in_use_by && vehicle.in_use_by != driver.id)
			return res.status(409).send({ error: "Vehicle in use by another driver" });

		await driver.setVehicle(vehicle);
		return res.status(200).send(vehicle);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

router.delete("/:id/assign", async (req,res) => {
	const { id } = req.params;
	const companyId = limitCompanyScope(req);
	try {
		const vehicle = await Vehicle.findOne({ where: {
			id,
			...(companyId ? {company_id: companyId}:{})
		}});

		if(!vehicle) return res.status(404).send({ error: "Vehicle not found" });
		if(vehicle.in_use_by && req.user.driver_id && vehicle.in_use_by !== req.user.driver_id) 
			return res.status(403).send({ error: "Vehicle assigned to another driver" });

		await vehicle.setDriver(null);
		return res.status(204).end();
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal Server Error" });
	}
});

module.exports = router;