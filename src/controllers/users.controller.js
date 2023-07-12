import  {
    findUser as findUserServices ,
    updateUserPass as updateUserPassServices ,
    getUsers as getUsersServices , 
    updateRole as updateRoleServices,
    cleanUsers as cleanUsersServices
} from '../services/users.services.js';
import { createHash } from '../utils.js';
import { generateToken } from '../config/jwt.config.js';
import { deleteUser as deleteUserMail } from '../config/nodemailer.config.js';
import logger from '../config/winston.config.js';
import UserDto from '../dao/DTOs/users.dto.js';

const changePass = async (req, res) => {
    const { email, password } = req.body;
    try {                     
        if(!email || !password) return res.status(400).send({status: 'error', message: 'Incomplete Values'});
        
        const user = await findUserServices( email );
  
        if (!user) return res.status(404).send({ status: 'error', message: 'User not Found' });
  
        user.password = createHash(password);
  
        await updateUserPassServices(email , user);
  
        res.status(200).send({ status: 'success', message: 'Reset Success' });
  
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    };
};

//Validaciones en passport.config.js
const createUser = async (req, res) => {
    try {  
      res.status(201).send({ status: "success", message: "user registered" });
    } catch (error) {
      logger.error(error);
      res.status(500).send({ status: 'error', error });
    };
};

const logOut =  async (req,res) =>{
    try {
        req.session.destroy((err) => {
            if (err) {
              res.status(500).send({ status: 'error', error: 'couldnt logout' });
            } else {
              logger.info('Session destroyed successfully!');
              res.clearCookie('cookieToken');
              res.redirect('/login');
            }
          });
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    };
};

//Validaciones en passport.config.js
const login = async (req, res) => {
    try {
        if(!req.user) return res.status(400)
            .send({status: 'error', message: 'Invalid Credentials'});
    
        const accessToken = await generateToken(req.user);
        
        res.cookie('cookieToken', accessToken, {
            maxAge: 2 * 60 * 60 * 1000, // 2hs
            httpOnly: true
        });
    
        logger.warning(accessToken);
    
        res.status(200).send({ status: 'success', acces_token: accessToken, message: 'login success' });
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    }
};

//Validaciones en passport.config.js
const github = async (req,res)=>{
    try {
        req.status(200).send({status: 'success', message: 'User Registered'});
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    };
};

//Validaciones en passport.config.js
const githubCallback =  async (req,res)=>{
    try {
        req.session.user = req.user;
        res.redirect('/');
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    };
};

const failLogin = async (req,res)=>{
    try {
        res.status(404).send({status: 'error', message:'login-failed'});
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    }
};

const failRegister = async  (req,res)=>{
    try {
        res.status(404).send({status: 'error', message:'register-failed'});
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    }
}

const current = async (req,res) =>{
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).send({ error: 'Usuario no autenticado' });
        };

        const userDto = new UserDto(user)

        res.status(200).send({status: 'success', payload: userDto});
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    };
}

const getUsers = async (req,res) =>{
   try {
        const user = req.user;

        if (!user) {
            return res.status(401).send({ error: 'Usuario no autenticado' });
        };
        
        const userDto = new UserDto(user);
        const sort = req.query.sort;
        const { limit = 10 } = req.query;
        const { page = 1 } = req.query;

        const { docs } = await getUsersServices(limit, page, sort);

        const users = docs.map( user => new UserDto(user));

        res.status(200).send({ status: 'success', payload: users  });
        
   } catch (error) {
      logger.error(error);
      res.status(500).send({ status: 'error', error });
   }
};

const usersActivityManual = async (req,res) =>{

    try {
        const  {email}  = req.body;

        const user = await findUserServices(email);
        
        if (!user) {
            return res.status(404).send({ error: 'Usuario no Encontrado' });
        };

        const id = user._id.toString();

        await cleanUsersServices(id);
        await deleteUserMail(user.email, user.first_name);
        
        
        res.status(200).send({ status: 'success', message: 'users deleted successfully' });

        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    };
};


const usersRole = async (req, res) => {
    const { email, role } = req.body;
    try {
        if (!email || !role) {
            return res.status(400).send({ error: 'Se requiere el email y el rol para actualizar el usuario' });
        };

        const result = await updateRoleServices(email, role);
        logger.info("resultado",result)

        res.status(200).send({ status: 'success', message: 'users role changed successfully' });
        
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', error });
    }
};

export {
    changePass,
    createUser,
    logOut,
    login,
    github,
    githubCallback,
    failLogin,
    failRegister,
    current,
    getUsers,
    usersRole,
    usersActivityManual
}