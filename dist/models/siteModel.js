"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const siteSchema = new mongoose_1.default.Schema({
    startingPoint: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    stayingPlace: {
        type: String,
        required: true,
    },
});
const SiteModel = mongoose_1.default.model('Site', siteSchema);
exports.default = SiteModel;
//# sourceMappingURL=siteModel.js.map