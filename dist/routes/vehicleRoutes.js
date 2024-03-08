"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicleController_1 = require("../controllers/vehicleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const vehicleRouter = express_1.default.Router();
vehicleRouter
    .route('/')
    .all(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin', 'owner'))
    .post(vehicleController_1.createVehicle)
    .get(vehicleController_1.getAllVehicles);
vehicleRouter
    .route('/:id')
    .all(authMiddleware_1.protect)
    .get(vehicleController_1.getVehicle)
    .patch((0, authMiddleware_1.restrictTo)('admin', 'owner'), vehicleController_1.updateVehicle)
    .delete((0, authMiddleware_1.restrictTo)('admin', 'owner'), vehicleController_1.deleteVehicle);
exports.default = vehicleRouter;
//# sourceMappingURL=vehicleRoutes.js.map