"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
class UserRepository {
    async findByEmail(email) {
        return User_1.default.findOne({ email });
    }
    async findById(id) {
        return User_1.default.findById(id);
    }
    async createUser(data) {
        return User_1.default.create(data);
    }
}
exports.UserRepository = UserRepository;
