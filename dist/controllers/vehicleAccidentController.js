"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleAccident = exports.updateVehicleAccident = exports.getVehicleAccident = exports.getAllVehicleAccidents = exports.createVehicleAccident = void 0;
const vehicleAccidentModel_1 = __importDefault(require("../models/vehicleAccidentModel"));
const asyncError_1 = __importDefault(require("../utils/asyncError"));
exports.createVehicleAccident = (0, asyncError_1.default)(async (req, res, next) => {
    const newVehicleAccident = await vehicleAccidentModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            vehicleAccident: newVehicleAccident,
        },
    });
});
exports.getAllVehicleAccidents = (0, asyncError_1.default)(async (req, res, next) => {
    const vehicleAccidents = await vehicleAccidentModel_1.default.find();
    res.status(200).json({
        status: 'success',
        results: vehicleAccidents.length,
        data: {
            vehicleAccidents,
        },
    });
});
exports.getVehicleAccident = (0, asyncError_1.default)(async (req, res, next) => {
    const vehicleAccident = await vehicleAccidentModel_1.default.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            vehicleAccident,
        },
    });
});
exports.updateVehicleAccident = (0, asyncError_1.default)(async (req, res, next) => {
    const updateVehicleAccident = await vehicleAccidentModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            vehicleAccident: updateVehicleAccident,
        },
    });
});
exports.deleteVehicleAccident = (0, asyncError_1.default)(async (req, res, next) => {
    const deleteVehicleAccident = await vehicleAccidentModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
//# sourceMappingURL=vehicleAccidentController.js.map