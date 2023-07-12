import { Schema, model} from "mongoose";

const cartCollection = 'carts';

const cartSchema =  new Schema(
    {
        products: {
            type: [
              {
                pId: {
                  type: Schema.Types.ObjectId,
                  ref: "products",
                },
                quantity: {
                  type: Number,
                  default: 1,
                },
              },
            ],
            default: []
          }
    }
);

cartSchema.pre('findOne', function (){
    this.populate('products.pId')
});

const cartModel = model(cartCollection, cartSchema);

export default cartModel;