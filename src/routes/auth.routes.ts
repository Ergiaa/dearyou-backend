import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema, updatePasswordSchema } from '../validations/auth.validation';

const router = Router();
const authController = new AuthController();

// Public routes with validation
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes with validation
router.get('/profile', authenticate, authController.getProfile);
router.patch(
  '/password',
  authenticate,
  validate(updatePasswordSchema),
  authController.updatePassword,
);

export default router;
