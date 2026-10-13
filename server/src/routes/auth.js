import { Router } from 'express';
import {
  getAdminAccess,
  getCurrentUser,
  login,
  register,
} from '../controllers/auth-controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getCurrentUser);
router.get('/admin', authenticate, requireAdmin, getAdminAccess);

export default router;
