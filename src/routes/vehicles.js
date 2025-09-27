const { Router } = require("express");
const { authenticate, hasRole, limitCompanyScope } = require("../middleware/authentication");
const { Vehicle, Driver, Sequelize: { Op } } = require("../models");
const { BadRequestError, ForbiddenError, NotFoundError, ConflictError } = require('../errors/httpErrors');

const router = Router();

router.use(authenticate);

router.post("/", hasRole("admin","company"), async (req,res,next) => {
	try {
		const company_id = limitCompanyScope(req) ?? req.body?.company_id;
		if(!company_id) throw new BadRequestError('Falta company_id');
		const vehicle = await Vehicle.create({ ...req.body, company_id, in_use_by: null });
		return res.status(201).send(vehicle);
	} catch (error) {
		next(error);
	}
});

router.put("/:id", hasRole("admin","company"), async (req,res,next) => {
	const { id } = req.params;
	try {
		const company_id = limitCompanyScope(req);
		const [found] = await Vehicle.update(req.body, {
			where : {
				id,
				...(company_id ? { company_id }:{})
			},
			fields: ['brand','model','license_plate','registration_date','type']
		});
		if(!found) throw new NotFoundError("Vehículo no encontrado");

		const vehicle = await Vehicle.findByPk(id);
		return res.status(200).send(vehicle);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", hasRole("admin","company"), async (req,res,next) => {
	const { id } = req.params;
	try {
		const company_id = limitCompanyScope(req);
		const found = await Vehicle.destroy({
			where : {
				id,
				...(company_id ? { company_id }:{})
			}
		});
		if(!found) throw new NotFoundError("Vehículo no encontrado");

		return res.status(204).end();
	} catch (error) {
		next(error);
	}
});

router.get("/", async (req,res,next) => {
	const { available } = req.query; // return only unused vehicles
	const company_id = limitCompanyScope(req) ?? req.query.company_id;
	try {
		const vehicles = await Vehicle.findAll({ where: {
			...(company_id ? {company_id}:{}),
			...(available === "true" ? {
				in_use_by: {
					[Op.is]: null
				}
			}:{})
		}});
		return res.status(200).send(vehicles);
	} catch (error) {
		next(error);
	}
});

router.get("/assigned", hasRole('driver'), async (req,res,next) => {
	try {
		if(req.user.role === "driver") return res.send(await req.user.Driver.getVehicle());
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req,res,next) => {
	const { id } = req.params;
	const company_id = limitCompanyScope(req);
	try {
		const vehicle = await Vehicle.findOne({ where: { id, company_id }});
		if(!vehicle) throw new NotFoundError('Vehículo no encontrado');
		return res.status(200).send(vehicle);
	} catch (error) {
		next(error);
	}
});

router.put("/:id/assign", async (req,res,next) => {
	const { id } = req.params;
	const company_id = limitCompanyScope(req);
	const where = company_id ? { company_id }:{}
	try {
		let driver = req.user.Driver;
		if(!driver) {
			if(!req.body?.driver_id) throw new BadRequestError('Falta driver_id');
			driver = await Driver.findOne({ where: {id: req.body.driver_id, ...where} });
		}
		if(!driver) throw new NotFoundError("Conductor no encontrado");

		let vehicle = await driver.getVehicle();
		if(vehicle) {
			if(driver.id !== vehicle.in_use_by) throw new ConflictError("El conductor ya tiene un vehículo asignado");
			return res.status(200).send(vehicle);
		}

		vehicle = await Vehicle.findOne({ where: {id, ...where} });
		if(!vehicle) throw new NotFoundError("Vehículo no encontrado");
		if(vehicle.in_use_by && vehicle.in_use_by != driver.id)
			throw new ConflictError("Vehículo en uso por otro conductor");

		await driver.setVehicle(vehicle);
		return res.status(200).send(vehicle);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id/assign", async (req,res,next) => {
	const { id } = req.params;
	const company_id = limitCompanyScope(req);
	try {
		const vehicle = await Vehicle.findOne({ where: {
			id,
			...(company_id ? {company_id}:{})
		}});

		if(!vehicle) throw new NotFoundError("Vehículo no encontrado");
		if(vehicle.in_use_by && req.user.driver_id && vehicle.in_use_by !== req.user.driver_id) 
			throw new ForbiddenError("Vehículo en uso por otro conductor");

		await vehicle.setDriver(null);
		return res.status(204).end();
	} catch (error) {
		next(error)
	}
});

module.exports = router;