import { Router } from 'express';
import { 
    getCarts,
    createCart,
    getCartById,
    updateCart,
    deleteCart,
    emptyCart,
    purchase
} from '../../controllers/carts.controller.js';

import { authenticateToken } from '../../config/jwt.config.js';
import  authorizeRol  from '../../config/role.config.js';


const router = Router();

//Crear Carrito:
router.post('/', authenticateToken, authorizeRol('user', 'premium'), createCart);

//Mostrar Carrito especifico:
router.get('/:cid', authenticateToken, authorizeRol('user', 'premium', 'admin'), getCartById);

//Llamar a todos los carritos:
router.get('/', authenticateToken, authorizeRol( 'admin' ), getCarts);

//Agregar o quitar un producto del carrito:
router.put('/:cid/products/:pid', authenticateToken, authorizeRol('user', 'premium', 'admin'), updateCart);

//Vaciar un carrito:
router.put('/:cid', authenticateToken, authorizeRol('user', 'premium', 'admin'), emptyCart);

//Borrar carrito:
router.delete('/:cid', authenticateToken, authorizeRol('user', 'premium', 'admin'), deleteCart);


//Finalizar la compra
router.post('/:cid/purchase', authenticateToken, authorizeRol('user', 'premium'), purchase);

export default router;