"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDriver = exports.updateDriver = exports.getDriver = exports.getAllDrivers = exports.createDriver = exports.resizeUserPhoto = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const asyncError_1 = __importDefault(require("../utils/asyncError"));
const driverModel_1 = __importDefault(require("../models/driverModel"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const appError_1 = __importDefault(require("../utils/appError"));
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new appError_1.default('Not an image! Please upload only images.', 400), false);
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = (0, asyncError_1.default)(async (req, res, next) => {
    if (!req.file)
        return next();
    req.file.filename = `driver-${req.params.id}-${Date.now()}.jpeg`;
    await (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/drivers/${req.file.filename}`);
    next();
});
exports.createDriver = (0, asyncError_1.default)(async (req, res, next) => {
    const newDriver = await driverModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            driver: newDriver,
        },
    });
});
exports.getAllDrivers = (0, asyncError_1.default)(async (req, res, next) => {
    const features = new apiFeatures_1.default(driverModel_1.default.find(), req.query)
        .filter()
        .limitFields()
        .paginate()
        .sort();
    const drivers = await features.query;
    const searchString = 'eth';
    const regex = new RegExp(`^${searchString}`, 'i');
    res.status(200).json({
        status: 'success',
        results: drivers.length,
        data: {
            drivers,
        },
    });
});
exports.getDriver = (0, asyncError_1.default)(async (req, res, next) => {
    const driver = await driverModel_1.default.findById(req.params.id)
        .populate({
        path: 'vehicle',
        select: '-driver -__v',
    })
        .populate({
        path: 'faultRecord',
        select: '-driver -__v',
    });
    res.status(200).json({
        status: 'success',
        data: {
            driver,
        },
    });
});
exports.updateDriver = (0, asyncError_1.default)(async (req, res, next) => {
    if (req.file)
        req.body.photo = req.file.filename;
    console.log(req.file);
    const updateDriver = await driverModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate({
        path: 'vehicle',
        select: '-driver -__v',
    })
        .populate({
        path: 'faultRecord',
        select: '-driver -__v',
    });
    res.status(200).json({
        status: 'success',
        data: {
            driver: updateDriver,
        },
    });
});
exports.deleteDriver = (0, asyncError_1.default)(async (req, res, next) => {
    const deleteDriver = await driverModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
//# sourceMappingURL=driverController.js.map