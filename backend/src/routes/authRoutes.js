import express from 'express';
import {
  login,
  logout,
  register,
  resendOTP,
  verifyEmail,
} from '../controllers/authController.js';
import {
  loginSchema,
  registerSchema,
  resendOTPSchema,
  verifyEmailSchema,
} from '../validators/authValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validateRequest(resendOTPSchema), resendOTP);

export default router;
