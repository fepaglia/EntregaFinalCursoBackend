import mongoose from "mongoose";

const URI =  process.env.MONGO_URL;

try {
    await mongoose.connect(URI);
    console.log('Conectado a BDD');
} catch (error) {
    console.log(error);
}