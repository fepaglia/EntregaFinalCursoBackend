import { Router } from 'express';
import { rootView, loginRedirectView, loginView, registerView, resetPassView, cartView, productsView, productView, profileView, privateAccess, publicAccess, usersView } from '../../controllers/views.controllers.js';
import { authenticateToken } from '../../config/jwt.config.js';
import authorizeRol  from '../../config/role.config.js';

const router = Router();

//RUTA RAIZ:  
router.get('/', privateAccess, rootView);

//LOGIN, REGISTER:
router.get('/', publicAccess, loginRedirectView); 
router.get('/login', publicAccess, loginView);
router.get('/register', publicAccess, registerView);

//PRODUCTOS:
router.get('/products', privateAccess, authenticateToken, authorizeRol('user', 'premium','admin'), productsView);
router.get('/products/:pid', privateAccess, authenticateToken, authorizeRol('user', 'premium','admin'), productView);

//CARRITO
router.get('/carts/:cid', privateAccess, authenticateToken, authorizeRol('user', 'premium'), cartView);

//RESET PASSWORD:
router.get('/reset', publicAccess, resetPassView);

//VISTA de PERFIL:
router.get('/profile', privateAccess, authenticateToken, authorizeRol('user', 'premium', 'admin'), profileView);

//Vista de panel de ADMINISTRADOR de usuarios:
router.get('/users', privateAccess, authenticateToken, authorizeRol('admin'), usersView);

export default router;
