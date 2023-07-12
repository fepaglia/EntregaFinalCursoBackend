import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        thumbnail: {
            type: String
        },
        code: {
            type: String,
            unique: true,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'users',
            default: 'admin'
        }
    }
);
productSchema.pre('find', function (){
    this.populate('owner', '_id');
});

productSchema.plugin(mongoosePaginate);

const productModel = model(productCollection, productSchema);

export default productModel;