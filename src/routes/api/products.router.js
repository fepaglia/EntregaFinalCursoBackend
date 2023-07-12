import { Router } from 'express';
import {
    getProducts,
    addProduct,
    getProductsById,
    updateProduct,
    deleteProduct
} from '../../controllers/products.controller.js';
import { authenticateToken } from '../../config/jwt.config.js';
import authorizeRol from '../../config/role.config.js';

const router = Router();

//Crear Producto:
router.post('/', authenticateToken, authorizeRol('premium', 'admin'), addProduct);

//Traer un producto:
router.get('/:pid' , getProductsById);

//Traer todos los productos:
router.get('/', getProducts);

//Modificar:
router.put('/:pid', authenticateToken, authorizeRol('premium', 'admin'), updateProduct);

//Eliminar:
router.delete('/:pid', authenticateToken, authorizeRol('premium', 'admin'), deleteProduct);

export default router;




