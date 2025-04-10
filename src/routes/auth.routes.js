import { Router } from 'express';
import { register, login, profile,logout}from '../controllers/auth.controller.js';
import checkAuth from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', checkAuth ,  profile);

export default router;


