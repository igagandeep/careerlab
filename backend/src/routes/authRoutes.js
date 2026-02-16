import express from 'express';
import {
  login,
  logout,
  register,
  resendOTP,
  verifyEmail,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from '../controllers/authController.js';
import {
  loginSchema,
  registerSchema,
  resendOTPSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validateRequest(resendOTPSchema), resendOTP);
router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
router.post(
  '/verify-reset-code',
  validateRequest(verifyResetCodeSchema),
  verifyResetCode
);
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  resetPassword
);

export default router;
