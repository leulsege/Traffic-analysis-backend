"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const driverSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    licenseLevel: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    licenseExpiredDate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    commencementDate: {
        type: Date,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    idNumber: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
        default: null,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
driverSchema.virtual('vehicle', {
    ref: 'Vehicle',
    foreignField: 'driver',
    localField: '_id',
});
driverSchema.virtual('faultRecord', {
    ref: 'FaultRecord',
    foreignField: 'driver',
    localField: '_id',
});
const DriverModel = mongoose_1.default.model('Driver', driverSchema);
exports.default = DriverModel;
//# sourceMappingURL=driverModel.js.map