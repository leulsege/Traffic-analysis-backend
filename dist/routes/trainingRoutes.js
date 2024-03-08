"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trainingController_1 = require("../controllers/trainingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const trainingRouter = express_1.default.Router();
trainingRouter
    .route('/')
    .all(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin', 'owner'))
    .post(trainingController_1.createTraining)
    .get(trainingController_1.getAllTrainings);
trainingRouter
    .route('/:id')
    .all(authMiddleware_1.protect)
    .get(trainingController_1.getTraining)
    .patch((0, authMiddleware_1.restrictTo)('admin', 'owner'), trainingController_1.updateTraining)
    .delete((0, authMiddleware_1.restrictTo)('admin', 'owner'), trainingController_1.deleteTraining);
exports.default = trainingRouter;
//# sourceMappingURL=trainingRoutes.js.map