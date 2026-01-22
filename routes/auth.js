import express from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';

const authRouter = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit auth attempts to 5 per 15 minutes
  message: 'Too many auth attempts, please try again later.',
  skipSuccessfulRequests: true,
});

authRouter.post('/register', authLimiter, authController.validateRegister, authController.registerUser);
authRouter.post('/login', authLimiter, authController.validateLogin, authController.loginUser);
authRouter.post('/logout', authController.logoutUser);

export { authRouter };
