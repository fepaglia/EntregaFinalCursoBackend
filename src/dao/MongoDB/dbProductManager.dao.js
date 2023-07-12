import productModel from './models/products.model.js';

export default class dBProductManager {
    constructor(){
        console.log('Working products with mongoDB');
    };

    getProducts = async (limit, page, sort) =>{
                if (sort) {
                    let sortOption = {};
                    if (sort === "asc") {
                        sortOption = { price: 'asc' };
                    } else if (sort === "desc") {
                        sortOption = { price: 'desc' };
                    }
                    sort = sortOption;
                }
        return await productModel.paginate({}, { limit, page, sort, lean: true });
    };

    addProduct = async (newProduct) =>{
        return await productModel.create(newProduct);
    };

    getProductsById = async (id) =>{
        return await productModel.findOne({_id: id})
    };

    updateProduct = async (id, updateProduct) =>{
        return await productModel.updateOne({_id: id}, updateProduct)
    };

    deleteProduct = async (id) =>{
        return await productModel.deleteOne({_id: id})
    };
};