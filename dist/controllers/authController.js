"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.login = exports.signup = void 0;
const userRepository_1 = require("../repositories/userRepository");
const jwt_1 = require("../utils/jwt");
const enums_1 = require("../utils/enums");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userRepo = new userRepository_1.UserRepository();
const signup = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        const existingUser = await userRepo.findByEmail(email);
        if (existingUser) {
            return res.status(enums_1.HttpStatus.BAD_REQUEST).json({ message: "User already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await userRepo.createUser({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
        });
        const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id, role: user.role });
        res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 }); // 15 mins
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        res.status(enums_1.HttpStatus.OK).json({ message: "Signup successful", user: { id: user._id, role: user.role } });
    }
    catch (error) {
        res.status(enums_1.HttpStatus.SERVER_ERROR).json({ message: "Server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userRepo.findByEmail(email);
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(enums_1.HttpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }
        const accessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id, role: user.role });
        res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(enums_1.HttpStatus.OK).json({ message: "Login successful", user: { id: user._id, role: user.role } });
    }
    catch (error) {
        res.status(enums_1.HttpStatus.SERVER_ERROR).json({ message: "Server error" });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(enums_1.HttpStatus.OK).json({ message: "Logged out successfully" });
};
exports.logout = logout;
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(enums_1.HttpStatus.UNAUTHORIZED).json({ message: "No refresh token provided" });
    }
    try {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const user = await userRepo.findById(decoded.id); // Use findById instead
        if (!user) {
            return res.status(enums_1.HttpStatus.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)({ id: user.id, role: user.role });
        res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.status(enums_1.HttpStatus.OK).json({ message: "Token refreshed" });
    }
    catch (error) {
        res.status(enums_1.HttpStatus.UNAUTHORIZED).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
