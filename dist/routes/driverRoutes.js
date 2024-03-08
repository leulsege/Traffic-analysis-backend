"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driverController_1 = require("../controllers/driverController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const driverRouter = express_1.default.Router();
driverRouter
    .route('/uploadphoto/:id')
    .patch(authMiddleware_1.protect, driverController_1.uploadUserPhoto, driverController_1.resizeUserPhoto, driverController_1.updateDriver);
driverRouter
    .route('/')
    .all(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin', 'owner'))
    .get(driverController_1.getAllDrivers)
    .post(driverController_1.createDriver);
driverRouter
    .route('/:id')
    .all(authMiddleware_1.protect)
    .get(driverController_1.getDriver)
    .patch((0, authMiddleware_1.restrictTo)('admin', 'owner'), driverController_1.updateDriver)
    .delete((0, authMiddleware_1.restrictTo)('admin', 'owner'), driverController_1.deleteDriver);
exports.default = driverRouter;
//# sourceMappingURL=driverRoutes.js.map