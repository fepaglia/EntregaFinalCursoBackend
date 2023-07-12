import jwt from 'jsonwebtoken';
import config from './config.js';

const PRIVATE_KEY = config.jwt_key;

export const generateToken = async (user) => {
    const token = jwt.sign({
        user
    }, PRIVATE_KEY, {
        expiresIn: '24h'
    });
    return token;
};


export const authenticateToken = async (req, res, next) => {
    const token = req.cookies['cookieToken'];

    if (token == null) {

        return res.status(401).send('unauthorized, Wrong Token');
    };
    
    jwt.verify(token, PRIVATE_KEY, (err, user) => {
        if (err) {
            return res.status(403).send('forbbiden');
        }
        req.user = user;
        next();
    });
};