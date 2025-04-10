import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import checkAuth from '../middleware/auth.middleware.js'; // Importar checkAuth

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', checkAuth, logout); // Proteger la ruta de logout con checkAuth

export default router;


