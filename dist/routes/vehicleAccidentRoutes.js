"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicleAccidentController_1 = require("../controllers/vehicleAccidentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const vehicleAccidentRouter = express_1.default.Router();
vehicleAccidentRouter
    .route('/')
    .all(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin', 'owner'))
    .post(vehicleAccidentController_1.createVehicleAccident)
    .get(vehicleAccidentController_1.getAllVehicleAccidents);
vehicleAccidentRouter
    .route('/:id')
    .all(authMiddleware_1.protect)
    .get(vehicleAccidentController_1.getVehicleAccident)
    .patch((0, authMiddleware_1.restrictTo)('admin', 'owner'), vehicleAccidentController_1.updateVehicleAccident)
    .delete((0, authMiddleware_1.restrictTo)('admin', 'owner'), vehicleAccidentController_1.deleteVehicleAccident);
exports.default = vehicleAccidentRouter;
//# sourceMappingURL=vehicleAccidentRoutes.js.map