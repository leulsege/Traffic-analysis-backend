"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicle = exports.getAllVehicles = exports.createVehicle = void 0;
const asyncError_1 = __importDefault(require("../utils/asyncError"));
const vehicleModel_1 = __importDefault(require("../models/vehicleModel"));
exports.createVehicle = (0, asyncError_1.default)(async (req, res, next) => {
    const newVehicle = await vehicleModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            vehicle: newVehicle,
        },
    });
});
exports.getAllVehicles = (0, asyncError_1.default)(async (req, res, next) => {
    const vehicles = await vehicleModel_1.default.find();
    res.status(200).json({
        status: 'success',
        results: vehicles.length,
        data: {
            vehicles,
        },
    });
});
exports.getVehicle = (0, asyncError_1.default)(async (req, res, next) => {
    const vehicle = await vehicleModel_1.default.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            vehicle,
        },
    });
});
exports.updateVehicle = (0, asyncError_1.default)(async (req, res, next) => {
    const updateVehicle = await vehicleModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            vehicle: updateVehicle,
        },
    });
});
exports.deleteVehicle = (0, asyncError_1.default)(async (req, res, next) => {
    const deleteVehicle = await vehicleModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
//# sourceMappingURL=vehicleController.js.map