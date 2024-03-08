"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.resizeUserPhoto = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const asyncError_1 = __importDefault(require("../utils/asyncError"));
const adminModel_1 = require("../models/adminModel");
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
    console.log(req.user._id);
    req.file.filename = `admin-${req.user._id}-${Date.now()}.jpeg`;
    await (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/admins/${req.file.filename}`);
    next();
});
exports.getAllUsers = (0, asyncError_1.default)(async (req, res, next) => {
    const users = await adminModel_1.User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});
exports.getUser = (0, asyncError_1.default)(async (req, res, next) => {
    const user = await adminModel_1.User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});
exports.updateUser = (0, asyncError_1.default)(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError_1.default('This route is not for password updates. Please use /updateMyPassword.', 400));
    }
    req.params.id = req.user._id;
    if (req.file)
        req.body.photo = req.file.filename;
    const updateUser = await adminModel_1.User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser,
        },
    });
});
exports.deleteUser = (0, asyncError_1.default)(async (req, res, next) => {
    const deleteUser = await adminModel_1.User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
//# sourceMappingURL=adminController.js.map