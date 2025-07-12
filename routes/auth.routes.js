import express from 'express';
import { renderLogin, loginUser, renderRegister, registerUser, logoutUser, updateUser, updateUserSettings } from '../controllers/auth.controller.js';
const router = express.Router();

// Middleware to protect profile route
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Rutas de Login
router.get('/login', renderLogin);
router.post('/login', loginUser);

// Rutas de Registro
router.get('/register', renderRegister);
router.post('/register', registerUser);

// Ruta de Logout
router.get('/logout', logoutUser);

// Ruta de Perfil
router.post('/profile', isAuthenticated, updateUser);

// Ruta para guardar la configuración del usuario
router.put('/user/settings', isAuthenticated, updateUserSettings);

export default router;
