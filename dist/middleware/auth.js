"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const enums_1 = require("../utils/enums");
const authenticateToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(enums_1.HttpStatus.UNAUTHORIZED).json({ message: 'Access token required' });
    }
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(accessToken);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(enums_1.HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
