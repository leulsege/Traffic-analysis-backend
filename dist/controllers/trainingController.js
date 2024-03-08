"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTraining = exports.updateTraining = exports.getTraining = exports.getAllTrainings = exports.createTraining = void 0;
const asyncError_1 = __importDefault(require("../utils/asyncError"));
const trainingModel_1 = __importDefault(require("../models/trainingModel"));
exports.createTraining = (0, asyncError_1.default)(async (req, res, next) => {
    const newTraining = await trainingModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            training: newTraining,
        },
    });
});
exports.getAllTrainings = (0, asyncError_1.default)(async (req, res, next) => {
    const trainings = await trainingModel_1.default.find();
    res.status(200).json({
        status: 'success',
        results: trainings.length,
        data: {
            trainings,
        },
    });
});
exports.getTraining = (0, asyncError_1.default)(async (req, res, next) => {
    const training = await trainingModel_1.default.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            training,
        },
    });
});
exports.updateTraining = (0, asyncError_1.default)(async (req, res, next) => {
    const updateTraining = await trainingModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            training: updateTraining,
        },
    });
});
exports.deleteTraining = (0, asyncError_1.default)(async (req, res, next) => {
    const deleteTraining = await trainingModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
//# sourceMappingURL=trainingController.js.map