"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const siteController_1 = require("../controllers/siteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const siteRouter = express_1.default.Router();
siteRouter
    .route('/')
    .all(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin', 'owner'))
    .post(siteController_1.createSite)
    .get(siteController_1.getAllSites);
siteRouter
    .route('/:id')
    .all(authMiddleware_1.protect)
    .get(siteController_1.getSite)
    .patch((0, authMiddleware_1.restrictTo)('admin', 'owner'), siteController_1.updateSite)
    .delete((0, authMiddleware_1.restrictTo)('admin', 'owner'), siteController_1.deleteSite);
exports.default = siteRouter;
//# sourceMappingURL=siteRoutes.js.map