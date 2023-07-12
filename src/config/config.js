import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    jwt_key: process.env.PRIVATE_KEY,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    enviroment: process.env.NODE_ENVIROMENT
}