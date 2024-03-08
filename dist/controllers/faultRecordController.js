"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaultRecord = exports.updateFaultRecord = exports.getFaultRecord = exports.getAllFaultRecords = exports.createFaultRecord = void 0;
const asyncError_1 = __importDefault(require("../utils/asyncError"));
const faultRecordModel_1 = __importDefault(require("../models/faultRecordModel"));
exports.createFaultRecord = (0, asyncError_1.default)(async (req, res, next) => {
    const newFaultRecord = await faultRecordModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            faultRecord: newFaultRecord,
        },
    });
});
exports.getAllFaultRecords = (0, asyncError_1.default)(async (req, res, next) => {
    const faultRecords = await faultRecordModel_1.default.find();
    res.status(200).json({
        status: 'success',
        results: faultRecords.length,
        data: {
            faultRecords,
        },
    });
});
exports.getFaultRecord = (0, asyncError_1.default)(async (req, res, next) => {
    const faultRecord = await faultRecordModel_1.default.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            faultRecord,
        },
    });
});
exports.updateFaultRecord = (0, asyncError_1.default)(async (req, res, next) => {
    const updateFaultRecord = await faultRecordModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            faultRecord: updateFaultRecord,
        },
    });
});
exports.deleteFaultRecord = (0, asyncError_1.default)(async (req, res, next) => {
    const deleteFaultRecord = await faultRecordModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
//# sourceMappingURL=faultRecordController.js.map