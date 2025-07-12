import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

/* GET home page. */
router.get('/', function(req, res, next) {
  // Render the index page without the main layout
  res.render('index', { title: 'Kipux AI', user: req.session.user });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Iniciar Sesión', layout: false });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registro', layout: false });
});

export default router;
