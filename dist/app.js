"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path = __importStar(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const driverRoutes_1 = __importDefault(require("./routes/driverRoutes"));
const trainingRoutes_1 = __importDefault(require("./routes/trainingRoutes"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const faultRecordRoutes_1 = __importDefault(require("./routes/faultRecordRoutes"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const vehicleAccidentRoutes_1 = __importDefault(require("./routes/vehicleAccidentRoutes"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use('/admins', adminRoutes_1.default);
app.use('/drivers', driverRoutes_1.default);
app.use('/trainings', trainingRoutes_1.default);
app.use('/faultrecords', faultRecordRoutes_1.default);
app.use('/vehicleaccidents', vehicleAccidentRoutes_1.default);
app.use('/vehicles', vehicleRoutes_1.default);
app.use(errorMiddleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map