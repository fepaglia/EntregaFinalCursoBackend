import { CARTSDAO } from "../dao/index.js";

const getCarts = async () =>{
    const carts = await CARTSDAO.getCarts();
    return carts.map(c => c.toObject());
};

const createCart = async (newCart) =>{
    const cartAdded = await CARTSDAO.createCart(newCart);
    return cartAdded;
};

const getCartById = async(cid) =>{
    const searchCart = await CARTSDAO.getCartById(cid)
    return searchCart;
};

const updateCart = async (cid, updateCart) =>{
    const update =  await CARTSDAO.updateCart(cid, updateCart)
    return update;
};

const deleteCart = async (id) =>{
    const deletedCart = await CARTSDAO.deleteCart(id)
    return deletedCart;
};

const emptyCart = async (cid) => {
    const result = await CARTSDAO.emptyCart(cid);
    return result;
};

export {
    getCarts,
    createCart,
    getCartById,
    updateCart,
    deleteCart,
    emptyCart
};