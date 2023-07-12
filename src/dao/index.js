import mongoProductsDao from './MongoDB/dbProductManager.dao.js';
import mongoCartsDao from './MongoDB/dbCartManager.dao.js';
import mongoUsersDao from './MongoDB/dbUsersManager.dao.js';
import mongoTicketDao from './MongoDB/dbTicketManager.dao.js';
import mongoChatDao from './MongoDB/dbChatManager.dao.js';

//Importamos el config
import config from '../config/config.js';

const MongoProductsDao = new mongoProductsDao();
const MongoCartsDao = new mongoCartsDao();
const MongoUsersDao = new mongoUsersDao();
const MongoTicketDao = new mongoTicketDao();
const MongoChatDao = new mongoChatDao();

console.log(config.persistence)

export const PRODUCTSDAO = config.persistence === 'MEMORY' ? MemoryProductsDao : MongoProductsDao;
export const CARTSDAO = config.persistence === 'MEMORY' ? MemoryCartsDao : MongoCartsDao;
export const USERSDAO = config.persistence === 'MEMORY' ? MemoryUsersDao : MongoUsersDao;
export const TICKETDAO = config.persistence === 'MEMORY' ? MemoryTicketDao : MongoTicketDao;
export const CHATDAO = config.persistence === 'MEMORY' ? MemoryChatDao : MongoChatDao;


//Falta agregar persistencia en memoria