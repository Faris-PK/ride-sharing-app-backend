import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { HttpStatus } from "../utils/enums";

const authService = new AuthService();

export const signup = async (req: Request, res: Response) => { 
  try {
    const result = await authService.signup(req.body);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body, res);
    
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res.status(HttpStatus.SERVER_ERROR).json({ message: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  authService.logout(res);
  res.status(HttpStatus.OK).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.refreshToken(req.cookies.refreshToken, res);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid refresh token" });
  }
};
