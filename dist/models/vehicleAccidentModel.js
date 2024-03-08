"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accidentSchema = new mongoose_1.Schema({
    accident_date: { type: Date },
    accident_place: { type: String },
    damages: { type: String },
    cause: { type: String },
    guilty: { type: String },
    damageEstimation: { type: Number },
    insuranceSentDate: { type: Date },
    ኤክሰስ_የተቆረጠበት_ደብዳ_ቁጥር: { type: String },
    maintenanceProcess: { type: String },
    preformDate: { type: Date },
    ክፍያ_የተጠየቀበት_ቀን_የደብዳቤ_ቁጥር: { type: String },
    paymentRequestLetterDate: { type: Date },
    vehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'accident belongs to a vehicle'],
    },
    driver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Driver',
        required: [true, 'accident belongs to a driver'],
    },
});
accidentSchema.pre(/^find/, function (next) {
    this.populate('driver').populate({ path: 'vehicle', select: '-driver' });
    next();
});
const VehicleAccidentModel = (0, mongoose_1.model)('Accident', accidentSchema);
exports.default = VehicleAccidentModel;
//# sourceMappingURL=vehicleAccidentModel.js.map