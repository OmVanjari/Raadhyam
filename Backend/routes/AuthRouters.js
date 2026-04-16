import express from "express";
import { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword,
  verifyOTP,
  changePassword,
  checkAuth,
  googleAuth,
  googleAuthCallback
} from "../controllers/AuthController.js";
import verifyToken from "../middlewares/AuthmiddleWare.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/change-password", verifyToken, changePassword);
router.get("/check-auth", verifyToken, checkAuth);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;