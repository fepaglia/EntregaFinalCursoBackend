import {
    updateCart as updateCartServices,
    emptyCart as emptyCartServices
} from '../repository/carts.repository.js';
import {
    getProductsById as getProductsByIdServices, 
    updateProduct as updateProductServices
} from '../repository/products.repository.js';
import logger from '../config/winston.config.js';
import shortid from 'shortid';
import ticketModel from '../dao/MongoDB/models/ticket.model.js';
import { shopOrder as shopOrderMailing } from '../config/nodemailer.config.js';

export const updateCart = async (cart, prod, prodId, action) => {
    
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
    
    return cart;
};

export const purchase = async (cid, user, cart, userDto) =>{
    logger.info('entrada de servicio')
        // Obtener los productos del carrito
        const products = cart.products;
        logger.info(products)

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
        logger.info(newTicket);
       
        await shopOrderMailing(userDto.email, userDto.first_name, ticketData.code, ticketData.amount);
        logger.info('ORDEN CREADA');

        //Hacemos update del Carrito quedando solo los que no tienen stock, sino se vacia:
        if(productsNotAvailable.length != 0){
            await updateCartServices(cid, productsNotAvailable);
        }else {
            await emptyCartServices(cid);
        }


        return newTicket;
};


