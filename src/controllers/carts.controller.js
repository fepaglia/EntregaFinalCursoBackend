import {
    getCarts as getCartsServices,
    createCart as createCartServices, 
    getCartById as getCartByIdServices, 
    updateCart as updateCartServices,
    deleteCart as deleteCartServices, 
    emptyCart as emptyCartServices
} from '../repository/carts.repository.js';
import { getProductsById as getProductsByIdServices, updateProduct as updateProductServices} from '../repository/products.repository.js';
import { createCartUser as createCartUserServices } from '../repository/users.repository.js';
import { purchase as purchaseServices, updateCart as updateServices } from '../services/cart.services.js';
import UserDto from '../dao/DTOs/users.dto.js';
import logger from '../config/winston.config.js';


const createCart = async (req,res) =>{
    try {
        const newCart = await createCartServices();
        
        const userId = req.user._id;
        console.log(userId)
        
        await createCartUserServices(userId, newCart);
        
        res.status(200).send({result: 'success', payload: newCart});

    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const getCartById = async (req,res) =>{
    const id = req.params.cid;
    try {
        const cart = await getCartByIdServices(id);

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        res.status(200).send({result: 'success', payload: cart});
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const getCarts = async (req,res) =>{
    try {
        const carts = await getCartsServices();
        res.status(200).send({ result: 'success', payload: carts});
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const updateCart = async (req, res) => {
    const prodId = req.params.pid;
    const cartId = req.params.cid;
    const action = req.query.action;
    try {

    //Chequeamos que existan
      let cart = await getCartByIdServices(cartId);
        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        };

      const prod = await getProductsByIdServices(prodId);

        if (!prod) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        };

        let updateQuantity = await updateServices(cart, prod, prodId, action);
  
      const update = await updateCartServices(cartId, updateQuantity);

      if (!update) {
        return res.status(500).send({ error: 'Error al actualizar el carrito' });
      }
  
      res.status(200).send({ payload: update });
  
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
  };

const deleteCart = async (req, res)=>{
    const cid = req.params.cid;
    try {
        const deleteCart = await deleteCartServices(cid);
        res.status(200).send({result: 'success', payload: deleteCart})
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const emptyCart = async (req,res)=>{
    const id = req.params.cid;
    try {
        const emptyCart = await emptyCartServices(id);

        if (!emptyCart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        };

        res.status(200).send({result: 'success', payload: emptyCart});
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const purchase = async (req,res) =>{
    
    const cid = req.params.cid;
    const user = req.user;
    const userDto = new UserDto(user.user);
   
    try {
        const cart = await getCartByIdServices(cid);
        
        if (!cart) {
            return res.status(404).send('El carrito no existe o no está asociado a un usuario.' );
        };

        //Verificar que el carrito pertenezca al usuario
        if (!user.user.carts.find(c => c._id === cid)) {
            return res.status(404).send('El carrito indicado no está asociado a tu usuario.');
        };

        const order = await purchaseServices(cid, user, cart, userDto);

        logger.info(order)
        
        if(order) {
            return res.status(201).send( 'Ticket creado exitosamente, revise su casilla de correo');
        } else {
            return res.status(404).send('Su orden no pudo ser procesada. Por favor intente nuevamente, o contactese con Atencion al publico');
        }


    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};



export {
    getCarts,
    createCart,
    getCartById,
    updateCart,
    deleteCart,
    emptyCart,
    purchase,

};