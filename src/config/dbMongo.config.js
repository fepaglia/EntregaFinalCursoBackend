import mongoose from "mongoose";
import config from "./config.js";

const URI = config.mongoUrl;

try {
    await mongoose.connect(URI);
    console.log('Conectado a BDD');
} catch (error) {
    console.log(error);
}