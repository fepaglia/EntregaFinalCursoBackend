import mongoProductsDao from './MongoDB/dbProductManager.dao.js';
import mongoCartsDao from './MongoDB/dbCartManager.dao.js';
import mongoUsersDao from './MongoDB/dbUsersManager.dao.js';
import mongoTicketDao from './MongoDB/dbTicketManager.dao.js';
import mongoChatDao from './MongoDB/dbChatManager.dao.js';

const MongoProductsDao = new mongoProductsDao();
const MongoCartsDao = new mongoCartsDao();
const MongoUsersDao = new mongoUsersDao();
const MongoTicketDao = new mongoTicketDao();
const MongoChatDao = new mongoChatDao();

console.log(process.env.PERSISTENCE)

export const PRODUCTSDAO = process.env.PERSISTENCE === 'MEMORY' ? MemoryProductsDao : MongoProductsDao;
export const CARTSDAO = process.env.PERSISTENCE === 'MEMORY' ? MemoryCartsDao : MongoCartsDao;
export const USERSDAO = process.env.PERSISTENCE === 'MEMORY' ? MemoryUsersDao : MongoUsersDao;
export const TICKETDAO = process.env.PERSISTENCE === 'MEMORY' ? MemoryTicketDao : MongoTicketDao;
export const CHATDAO = process.env.PERSISTENCE === 'MEMORY' ? MemoryChatDao : MongoChatDao;


//Falta agregar persistencia en memoria