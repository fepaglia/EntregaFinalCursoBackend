import { getProducts as getProductsServices, getProductsById as getProductsByIdServices } from '../repository/products.repository.js';
import { getCartById as getCartByIdServices} from '../repository/carts.repository.js';
import { getUsers as getUsersServices } from '../repository/users.repository.js';
import logger from '../config/winston.config.js';
import UserDto from '../dao/DTOs/users.dto.js';
import ProductsDto from '../dao/DTOs/products.dto.js';

const rootView = async (req, res) => {
    try {
        res.redirect('/products');
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const loginRedirectView =  async (req, res) => {
    try {
        res.redirect('/login');
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const loginView = async (req, res) => {
    try {
        res.render('login', {style: 'login.css'});      
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const registerView = async  (req, res) => {
    try {
        res.render('register', {style: 'register.css'});
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const resetPassView = async (req, res) => {
    try {
        res.render('reset');
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const productsView = async (req,res)=>{

    try {
        const user = req.user.user;
        const userDto = new UserDto(user);
        const { limit = 10 } = req.query;
        const { page = 1 } = req.query;
        const sort = req.query.sort;
      
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await getProductsServices(limit, page, sort);
        
        let products = docs.filter((product) => product.stock > 0);

        products.map( prod => new ProductsDto(prod));
        
        let Id = user.carts[user.carts.length - 1]._id.toString();

      
        res.render('products', {
          products,
          user: userDto,
          cart: Id,
          hasPrevPage,
          hasNextPage,
          nextPage,
          prevPage,
          style: 'products.css'
        });

      } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const productView = async (req, res) =>{
    const prodId = req.params.pid;
    try {
        const productbyID = await getProductsByIdServices(prodId);

        if (!productbyID) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        };

        const productData = productbyID.toObject();
        
        res.render('productView', {product: productData , style: 'productView.css'});

    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const cartView = async (req, res) =>{
    const id = req.params.cid;
    try {
        let cart = await getCartByIdServices(id);

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        };

        res.render('carts', cart);
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const profileView = async (req, res) =>{
    const user = req.user.user;
    const userDto = new UserDto(user);
    try {

        if (!user) {
            return res.status(401).send({ error: 'Usuario no autenticado' });
        };


        if (user.carts.length === 0) {
            return res.status(404).send({ error: 'No se encontraron carritos' });
          }
        
        let cartsCode = user.carts[user.carts.length - 1]._id.toString();
        
        const getCart = await getCartByIdServices(cartsCode);

        if (!getCart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        };
        
        let listOfProducts = getCart.products.toObject();

        listOfProducts = listOfProducts.map((product) => {
            const totalAmount = product.pId.price * product.quantity;
            return { ...product, totalAmount };
          });

          
        const totalAmount = listOfProducts.reduce(
            (sum, product) => sum + product.totalAmount,
            0
        );
                 
        res.render('profile', { listOfProducts, user: userDto, cartsCode, totalAmount, style: 'profile.css' });
        
    } catch (error) {
        logger.error( error );
        res.status(500).send({ error });
    };
};

const usersView = async (req, res) =>{
    try {
        const user = req.user.user;

        if (!user) {
            return res.status(401).send({ error: 'Usuario no autenticado' });
        };

        const userDto = new UserDto(user);
        const sort = req.query.sort;
        const { limit = 10 } = req.query;
        const { page = 1 } = req.query;

        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await getUsersServices(limit, page, sort);

        const users = docs.map( user => new UserDto(user));

        res.render('usersView', {
            user: userDto,
            users, 
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            style: 'usersView.css'
        });
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    };
};

const orderView = async (req,res) =>{
    try {
        res.render('orderCreated')
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error });
    }
}


const publicAccess = (req, res, next) =>{
    if (req.cookies['cookieToken']) return res.redirect('/');
    next();
};

const privateAccess = (req, res, next) =>{
    if (!req.cookies['cookieToken']) return res.redirect('/login');
    next();
};


export {
    rootView,
    loginRedirectView,
    loginView,
    registerView,
    resetPassView,
    cartView,
    productsView,
    productView,
    profileView,
    publicAccess,
    privateAccess,
    usersView,
    orderView
};