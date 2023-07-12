import {
    getCarts as getCartsServices,
    createCart as createCartServices, 
    getCartById as getCartByIdServices, 
    updateCart as updateCartServices,
    deleteCart as deleteCartServices, 
    emptyCart as emptyCartServices
} from '../services/carts.services.js';
import { getProductsById as getProductsByIdServices, updateProduct as updateProductServices} from '../services/products.services.js';
import { createCartUser as createCartUserServices } from '../services/users.services.js';
import UserDto from '../dao/DTOs/users.dto.js';
import logger from '../config/winston.config.js';
import shortid from 'shortid';
import ticketModel from '../dao/MongoDB/models/ticket.model.js';
import { shopOrder as shopOrderMailing } from '../config/nodemailer.config.js';

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

        let toCart = { pId: prod._id, quantity: 1 }
      
        let existingProductIndex = cart.products.findIndex((item) => item.pId._id.toString() === prodId.toString());

        if (existingProductIndex !== -1) {
            if (action === 'increase') {
                cart.products[existingProductIndex].quantity += 1;
                //logger.info('sumamos') // Incrementar la cantidad
            } else if (action === 'decrease') {
                if (cart.products[existingProductIndex].quantity === 1) {
                    // Eliminar el producto si la cantidad es 0
                    cart.products.splice(existingProductIndex, 1);
                    //logger.info('eliminamos') 
                } else {
                    cart.products[existingProductIndex].quantity -= 1; // Disminuir la cantidad si es mayor a 1
                    //logger.info('restamos') 
                }
            }
        } else {
            //logger.info("producto nuevo");
            cart.products.push(toCart);
        }
  
      const update = await updateCartServices(cartId, cart);

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
        if(user.user.carts.find( c => c._id === cid)){
        } else {
            return res.status(404).send( 'El carrito indicado, no está asociado a tu usuario.');
        };

        // Obtener los productos del carrito
        const products = cart.products;

        // Verificar stock y calcular el monto total
        let totalAmount = 0;

        const productsNotAvailable = [];

        for (const product of products) {
            const { pId, quantity } = product;
            const productData = await getProductsByIdServices(pId);

            if (!productData || productData.stock < quantity) {
                productsNotAvailable.push(pId);
                continue;
            }

            totalAmount += productData.price * quantity;

            // Restar del stock del producto
            productData.stock -= quantity;
            await updateProductServices(pId, productData);
        }

        // Filtrar los productos no disponibles en el carrito
        cart.products = cart.products.filter(product => !productsNotAvailable.includes(product.pId));

        // Crear el ticket
        const ticketData = {
            code: shortid.generate(),
            amount: totalAmount,
            purchaser: user.user.email
        };
        const newTicket = await ticketModel.create(ticketData);

        //Hacemos update del Carrito quedando solo los que no tienen stock, sino se vacia:
        if(productsNotAvailable.length != 0){
            await updateCartServices(cid, productsNotAvailable);
        }else {
            await emptyCartServices(cid);
        }

        logger.info(newTicket);

        if (ticketData.amount === 0) {
            res.status(500).send({ error: 'No se puede generar una orden de compra de coste 0' });
        }

        await shopOrderMailing(userDto.email, userDto.first_name, ticketData.code, ticketData.amount);

        res.status(201).send({ message: 'Ticket creado exitosamente, revise su casilla de correo', ticket: newTicket }).redirect('/products');

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
    purchase
};