"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faultRecordController_1 = require("../controllers/faultRecordController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const faultRecordRouter = express_1.default.Router();
faultRecordRouter
    .route('/')
    .all(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin', 'owner'))
    .post(faultRecordController_1.createFaultRecord)
    .get(faultRecordController_1.getAllFaultRecords);
faultRecordRouter
    .route('/:id')
    .all(authMiddleware_1.protect)
    .get(faultRecordController_1.getFaultRecord)
    .patch((0, authMiddleware_1.restrictTo)('admin', 'owner'), faultRecordController_1.updateFaultRecord)
    .delete((0, authMiddleware_1.restrictTo)('admin', 'owner'), faultRecordController_1.deleteFaultRecord);
exports.default = faultRecordRouter;
//# sourceMappingURL=faultRecordRoutes.js.map