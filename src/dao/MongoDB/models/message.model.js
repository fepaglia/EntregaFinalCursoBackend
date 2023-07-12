import { Schema, model } from 'mongoose';

const messageCollection = 'message';

const messageSchema = new Schema(
    {
        user: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { 
        timestamps: true 
    }
);

const messageModel = model(messageCollection, messageSchema);

export default messageModel;