import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser'

import MongoStore from 'connect-mongo';

import sessionsRouter from './routes/api/sessions.router.js'
import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import usersRouter from './routes/api/users.router.js';
import viewsRouter from './routes/web/views.router.js';
 
import __dirname from './utils.js';

import passport from 'passport';
import initializePassport from './config/passport.config.js';
import logger, { addLogger } from './config/winston.config.js';

import './config/dbMongo.Config.js';
import config from './config/config.js';

const PORT = procces.env.PORT || 8080;
const ENVIROMENT = config.enviroment;
const MONGO_URI = config.mongoUrl;

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));

//Middleware Logger
app.use(addLogger);

//Configuracion sesion:
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        mongoOptions: { useNewUrlParser: true },
        ttl: 3600
       }),
    secret: 'secretCoder',  
    resave: true,
    saveUninitialized: true
}))


//Configuracion handlebars:
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars')


//Configuracion passport:
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.listen(PORT, ()=> logger.info(`Server On. 3preEntrega. Entorno de: ${ENVIROMENT}`));