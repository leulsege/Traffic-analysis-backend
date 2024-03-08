"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSite = exports.updateSite = exports.getSite = exports.getAllSites = exports.createSite = void 0;
const asyncError_1 = __importDefault(require("../utils/asyncError"));
const siteModel_1 = __importDefault(require("../models/siteModel"));
exports.createSite = (0, asyncError_1.default)(async (req, res, next) => {
    const newSite = await siteModel_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            site: newSite,
        },
    });
});
exports.getAllSites = (0, asyncError_1.default)(async (req, res, next) => {
    const sites = await siteModel_1.default.find();
    res.status(200).json({
        status: 'success',
        results: sites.length,
        data: {
            sites,
        },
    });
});
exports.getSite = (0, asyncError_1.default)(async (req, res, next) => {
    const site = await siteModel_1.default.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            site,
        },
    });
});
exports.updateSite = (0, asyncError_1.default)(async (req, res, next) => {
    const updateSite = await siteModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            site: updateSite,
        },
    });
});
exports.deleteSite = (0, asyncError_1.default)(async (req, res, next) => {
    const deleteSite = await siteModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
//# sourceMappingURL=siteController.js.map