import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

const userSchema = new Schema(
    {
        first_name: String,
        last_name: String,
        email: {
            type: String,
            unique: true,
            required: true,
            match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
        },
        carts: {
            type: [
                {
                    cart: {
                        type: Schema.Types.ObjectId,
                        ref:'carts'
                    }
                }
            ],
            default: []
        },
        role: {
            type: String,
            default: "user"
        },
        age: Number,
        password: String,
        lastConnection: {
            type: Date,
            default: Date.now
        }
    }
);
userSchema.plugin(mongoosePaginate);

const userModel = model(userCollection, userSchema);

export default userModel;