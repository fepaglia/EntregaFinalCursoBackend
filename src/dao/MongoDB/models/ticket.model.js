import { Schema, model } from 'mongoose';

const ticketCollection = 'ticket';

const ticketSchema = new Schema(
    {
        code: {
            type: String,
            unique: true,
            require: true,
          },
        amount: {
            type: Number,
            require: true,
          },
        purchaser: {
            type: Schema.Types.String,
            require: true,
            ref: 'users'
          },
    },
    {
        timestamps: {
            createdAt: "purchase_datetime",
          },
        versionKey: false
    }
);

ticketSchema.pre('find', function (){
  this.populate('purchaser', 'email');
});

const ticketModel = model(ticketCollection, ticketSchema);

export default ticketModel;