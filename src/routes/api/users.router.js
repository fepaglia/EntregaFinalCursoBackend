import { Router } from 'express';
import { getUsers, usersRole, usersActivityManual } from '../../controllers/users.controller.js';

import { authenticateToken } from '../../config/jwt.config.js';
import  authorizeRol  from '../../config/role.config.js';

const router = Router();

//Mostrar todos los usuarios:
router.get('/', authenticateToken, authorizeRol('admin'), getUsers);

//Modificar el rol:
router.put('/', authenticateToken, authorizeRol('admin'), usersRole);

//Eliminar por inactividad (MANUAL):
router.delete('/', authenticateToken, authorizeRol('admin'), usersActivityManual);


export default router;