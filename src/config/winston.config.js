import winston, { format } from 'winston';
import  __dirname  from '../utils.js'
import config from './config.js';

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

const colors = {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'green',
};

winston.addColors(colors);

//Formato de consola:
const myFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf((info)=> `${info.timestamp} ${info.level}: ${info.message}`)
);

//Formato para archivo:
const myFileFormat = format.combine(
    format.uncolorize(),
    format.timestamp(),
    format.json(),
    format.prettyPrint()
);

const options = {
    errorsFile : {
        level: 'error',
        filename: `${__dirname}/logs/errors.log`,
        handleExeptions: true,
        format: myFileFormat
    },
    consoleProd : {
        level: 'info',
        handleExeptions: true,
        format: myFormat
    },
    consoleDev : {
        level: 'debug',
        handleExeptions: true,
        format: myFormat
    }
}

const ENVIROMENT = config.enviroment;

let logger;

if(ENVIROMENT === 'PRODUCTION'){
    logger = winston.createLogger({
        levels,
        transports: [
            new winston.transports.File(options.errorsFile),
            new winston.transports.Console(options.consoleProd)
        ],
        exitOnError: false
    })
} else {
    logger = winston.createLogger({
        levels,
        transports: [
            new winston.transports.Console(options.consoleDev)
        ],
        exitOnError: false
    })
};

export const addLogger = (req, res, next) =>{
    req.logger = logger;
    req.logger.http(`Peticion: ${req.method} en la ruta: '${req.url}'`);
    next();
};

export default logger;