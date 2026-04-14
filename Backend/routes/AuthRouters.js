import express from "express";
import { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword,
  checkAuth,
  googleAuth,
  googleAuthCallback
} from "../controllers/AuthController.js";
import verifyToken from "../middlewares/AuthmiddleWare.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;