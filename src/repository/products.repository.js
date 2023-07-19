import { PRODUCTSDAO } from "../dao/index.js";

const getProducts = async (limit, page, sort) =>{
    const products = await PRODUCTSDAO.getProducts(limit, page, sort);
    return products;
};

const addProduct = async (newProduct) =>{
    const productAdded = await PRODUCTSDAO.addProduct(newProduct);
    return productAdded;
};

const getProductsById = async (id) =>{
    const product = await PRODUCTSDAO.getProductsById(id)
    return product;
};

const updateProduct = async (id, updateProduct) =>{
    const prodMod =  await PRODUCTSDAO.updateProduct(id, updateProduct);
    return prodMod;
};

const deleteProduct = async (id) =>{
    const deletedProduct = await PRODUCTSDAO.deleteProduct(id)
    return deletedProduct;
};

export {
    getProducts,
    addProduct,
    getProductsById,
    updateProduct,
    deleteProduct
};