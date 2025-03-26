import express, { Router } from "express";
import { login, logout, refreshToken, signup } from "../controllers/authController";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

export default router;