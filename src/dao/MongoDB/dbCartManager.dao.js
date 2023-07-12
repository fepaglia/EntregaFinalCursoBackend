import  cartModel  from './models/carts.model.js';

export default class dBCartManager {
    constructor(){
        console.log('Working carts with DB in mongoDB');
    };

    getCarts = async () =>{
        return await cartModel.find();
    };

    createCart = async (newCart) =>{
        return await cartModel.create(newCart);
    };

    getCartById = async(cid) =>{
        return await cartModel.findOne({_id: cid});
    };

    updateCart = async (cid, updateCart) =>{
        return await cartModel.findByIdAndUpdate({_id: cid}, updateCart);
    };

    deleteCart = async (id) =>{
        return await cartModel.deleteOne({_id: id})
    };

    emptyCart = async (cid) => {
        return await cartModel.updateOne({ _id: cid }, { products: [] });
    };
};