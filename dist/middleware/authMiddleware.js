"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.signin = exports.verification = exports.signup = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const asyncError_1 = __importDefault(require("../utils/asyncError"));
const appError_1 = __importDefault(require("../utils/appError"));
const adminModel_1 = require("../models/adminModel");
const util_1 = require("util");
const crypto_1 = __importDefault(require("crypto"));
const emial_1 = __importDefault(require("../utils/emial"));
const signToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d',
    });
};
const createSendToken = (user, statusCode, res) => {
    if (user.verified && user.approved) {
        const token = signToken(user._id);
        const cookieOptions = {
            expires: new Date(Date.now() +
                parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        };
        res.cookie('token', token, cookieOptions);
        user.password = undefined;
        res.status(statusCode).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    else {
        res.status(403).json({
            status: 'failed',
            message: 'please verify and/or approved your account',
        });
    }
};
exports.signup = (0, asyncError_1.default)(async (req, res, next) => {
    const lengthOfUsers = await adminModel_1.User.countDocuments();
    if (lengthOfUsers === 0) {
        req.body.role = 'owner';
        req.body.approved = true;
    }
    else {
        req.body.role = 'admin';
        req.body.approved = false;
    }
    const newUser = await adminModel_1.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
        approved: req.body.approved,
        verified: false,
    });
    const resetToken = newUser.createPasswordResetToken();
    await newUser.save({ validateBeforeSave: false });
    const verificationURL = `${req.protocol}://${req.get('host')}/admins/verify/${resetToken}`;
    const message = `welecome to PSTS, click the the link to verify your email: ${verificationURL}.\nIf you didn't signup, please ignore this email!`;
    try {
        await (0, emial_1.default)({
            email: req.body.email,
            subject: 'account verification (valid for 1 day)',
            message,
        });
        res.status(200).json({
            status: 'success',
            message: 'we have sent a verification email!',
        });
    }
    catch (err) {
        await newUser.deleteOne({ email: req.body.email });
        return next(new appError_1.default('There was an error sending the email. Try again later!', 500));
    }
});
exports.verification = (0, asyncError_1.default)(async (req, res, next) => {
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await adminModel_1.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new appError_1.default('Token is invalid or has expired', 400));
    }
    user.verified = true;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    if (user.approved)
        return createSendToken(user, 200, res);
    res.status(200).json({
        status: 'success',
        message: 'you have signed up succesfully. once the owner approved, you can sign in',
    });
});
exports.signin = (0, asyncError_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('Please provide email and password!', 400));
    }
    const user = await adminModel_1.User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.default('Incorrect email or password', 401));
    }
    createSendToken(user, 200, res);
});
exports.protect = (0, asyncError_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return next(new appError_1.default('You are not logged in! Please log in to get access.', 401));
    }
    const decoded = await (0, util_1.promisify)(jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
    const currentUser = await adminModel_1.User.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.default('The user belonging to this token does no longer exist.', 401));
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default('User recently changed password! Please log in again.', 401));
    }
    ;
    req.user = currentUser;
    next();
});
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.default('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, asyncError_1.default)(async (req, res, next) => {
    const user = await adminModel_1.User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default('There is no user with email address.', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get('host')}/admins/resetpassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await (0, emial_1.default)({
            email: user.email,
            subject: 'Your password reset token (valid for 1 day)',
            message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError_1.default('There was an error sending the email. Try again later!', 500));
    }
});
exports.resetPassword = (0, asyncError_1.default)(async (req, res, next) => {
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await adminModel_1.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new appError_1.default('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
});
exports.updatePassword = (0, asyncError_1.default)(async (req, res, next) => {
    const user = await adminModel_1.User.findById(req.user._id).select('+password');
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new appError_1.default('Your current password is wrong.', 401));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    createSendToken(user, 200, res);
});
const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
    });
    res.status(200).json({ status: 'success' });
};
exports.logout = logout;
//# sourceMappingURL=authMiddleware.js.map