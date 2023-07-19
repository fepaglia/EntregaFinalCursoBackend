import {
    getProducts as getProductsServices ,
    addProduct as addProductServices,
    getProductsById as getProductsByIdServices,
    updateProduct as updateProductServices,
    deleteProduct as deleteProductServices
} from '../repository/products.repository.js';
import { getUserById as getUserByIdServices } from '../repository/users.repository.js';
import logger from '../config/winston.config.js';
import { deleteProduct as deleteProductMail } from '../config/nodemailer.config.js';
import UserDto from '../dao/DTOs/users.dto.js';

const addProduct =  async (req,res) =>{
    const {title,description,price,thumbnail,status,code,stock} = req.body;
    try {

        if (!title || !description || !price || !thumbnail || !status || !code || !stock) {
            return res.status(400).send({ error: 'Faltan campos requeridos' });
        };
    
        if (typeof title !== 'string' || typeof description !== 'string' || typeof thumbnail !== 'string' || typeof status !== 'string' || typeof code !== 'string' || typeof stock !== 'number' || typeof price !== 'number') {
            return res.status(400).send({ error: 'Formato de campos inválido' });
        };
    
        if (price < 0 || stock < 0) {
            return res.status(400).send({ error: 'Los campos price y stock deben ser números positivos' });
        };
    
        const result = await addProductServices(
        {
            title,
            description,
            price,
            thumbnail,
            status,
            code,
            stock
        }
    );
        res.status(200).send({ result: 'success', payload: result});
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
  
};

const getProductsById = async (req,res) =>{
    let id = req.params.pid;
    try {
        const result = await getProductsByIdServices(id);

        if (!result) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        };

        res.status(200).send({ result: 'success', payload: result});
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const getProducts = async (req, res)=>{
    try {
        const products = await getProductsServices();
        res.status(200).send({ result: 'success', payload: products});
       
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const updateProduct =  async (req,res)=>{
    let id = req.params.pid;
    const updateObj = req.body;
    try {

        const result = await updateProductServices(id,updateObj);

        res.status(200).send({status:"success", payload: result})
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const deleteProduct = async (req,res) =>{
    let id = req.params.pid;    
    try {
        const user = req.user.user;
        const userDto = new UserDto(user);

        const product = await getProductsByIdServices(id);
            if (!product) {
                return res.status(404).send({ error: 'Producto no encontrado' });
            };
        
            if(product.owner === userDto._id) {
                return await deleteProductServices(id);
            };

            if (userDto.role === 'admin') {
                let product = await deleteProductServices(id);

                    const user = await getUserByIdServices(product.owner);
                        if(user.role === 'premium') {

                            await deleteProductMail(user.email, user.first_name, product);
                        }

            };


        res.status(200).send({status: "success", payload: product});
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

export {
    getProducts,
    addProduct,
    getProductsById,
    updateProduct,
    deleteProduct
};