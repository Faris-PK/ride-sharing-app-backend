import { UserRepository } from "../repositories/userRepository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { IUser } from "../models/User";

export class AuthService {
  private userRepo = new UserRepository();

  async signup(data: { name: string; email: string; password: string; phone: string; role: string }) {
    const { name, email, password, phone, role } = data;
    
    
    const existingUser = await this.userRepo.findByEmail(email);
    console.log('existingUser : ', existingUser);
    
    if (existingUser) {
      throw new Error("User already exists....");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = await this.userRepo.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    return { message: "Signup successful", user: { id: user._id, role: user.role } };
  }

  async login(data: { email: string; password: string }, res: Response) {
    const { email, password } = data;
    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return { message: "Login successful", user: { id: user._id, role: user.role, name: user.name, email: user.email } };
  }

  logout(res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }

  async refreshToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const decoded = verifyRefreshToken(refreshToken) as { id: string; role: string };
    const user = await this.userRepo.findById(decoded.id);
    if (!user) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
    res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

    return { message: "Token refreshed" };
  }
}
