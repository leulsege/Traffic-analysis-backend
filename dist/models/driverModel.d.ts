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
import mongoose, { Document, Types } from 'mongoose';
interface Driver extends Document {
    name: string;
    licenseLevel: string;
    licenseNumber: string;
    licenseExpiredDate: Date;
    gender: string;
    commencementDate: Date;
    age: number;
    idNumber: string;
    startingPoint: string;
    destination: string;
    stayingPlace: string;
    photo?: string | null;
}
declare const DriverModel: mongoose.Model<Driver, {}, {}, {}, mongoose.Document<unknown, {}, Driver> & Driver & {
    _id: Types.ObjectId;
}, any>;
export default DriverModel;
