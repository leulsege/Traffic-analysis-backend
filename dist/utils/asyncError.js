"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.log(err);
            return next(err);
        });
    };
};
exports.default = asyncError;
//# sourceMappingURL=asyncError.js.map