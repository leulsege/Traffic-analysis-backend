"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminController_1 = require("../controllers/adminController");
const adminRoute = express_1.default.Router();
adminRoute.post('/signup', authMiddleware_1.signup);
adminRoute.post('/signin', authMiddleware_1.signin);
adminRoute.get('/verify/:token', authMiddleware_1.verification);
adminRoute.get('/logout', authMiddleware_1.logout);
adminRoute.patch('/updatemypassword', authMiddleware_1.protect, authMiddleware_1.updatePassword);
adminRoute.post('/forgetpassword', authMiddleware_1.forgotPassword);
adminRoute.patch('/resetpassword/:token', authMiddleware_1.resetPassword);
adminRoute.route('/').all(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('owner')).get(adminController_1.getAllUsers);
adminRoute
    .route('/uploadphoto')
    .patch(authMiddleware_1.protect, adminController_1.uploadUserPhoto, adminController_1.resizeUserPhoto, adminController_1.updateUser);
adminRoute
    .route('/:id')
    .all(authMiddleware_1.protect)
    .get(adminController_1.getUser)
    .patch((0, authMiddleware_1.restrictTo)('owner'), adminController_1.updateUser)
    .delete((0, authMiddleware_1.restrictTo)('owner'), adminController_1.deleteUser);
exports.default = adminRoute;
//# sourceMappingURL=adminRoutes.js.map