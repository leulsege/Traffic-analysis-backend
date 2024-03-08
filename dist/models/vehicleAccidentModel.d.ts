/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
interface VehicleAccident extends Document {
    accident_date: Date;
    accident_place: string;
    damages: string;
    cause: string;
    guilty: string;
    damageEstimation: number;
    insuranceSentDate: Date;
    maintenanceProcess: string;
    preformDate: Date;
    ክፍያ_የተጠየቀበት_ቀን_የደብዳቤ_ቁጥር: string;
    paymentRequestLetterDate: Date;
}
declare const VehicleAccidentModel: import("mongoose").Model<VehicleAccident, {}, {}, {}, Document<unknown, {}, VehicleAccident> & VehicleAccident & {
    _id: import("mongoose").Types.ObjectId;
}, any>;
export default VehicleAccidentModel;
