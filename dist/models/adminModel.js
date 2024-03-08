"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const class_validator_1 = require("class-validator");
const bcrypt_1 = require("bcrypt");
const crypto_1 = __importDefault(require("crypto"));
class User {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['admin', 'owner']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'please provide first name'],
    },
    lastName: {
        type: String,
        required: [true, 'please provide last name'],
    },
    email: {
        type: String,
        required: [true, 'please provide an email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        required: [true, 'please assign a role'],
        enum: ['admin', 'owner'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm the password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verified: {
        type: Boolean,
        default: false,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    photo: {
        type: String,
        default: null,
    },
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await (0, bcrypt_1.hash)(this.password, 12);
    this.confirmPassword = undefined;
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await (0, bcrypt_1.compare)(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000;
    return resetToken;
};
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.User = UserModel;
//# sourceMappingURL=adminModel.js.map