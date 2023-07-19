import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import { createCartUser } from '../repository/users.repository.js';
import userModel from '../dao/MongoDB/models/users.model.js';
import { createCart } from '../repository/carts.repository.js';
import { createHash, isValidPassword } from '../utils.js';
import UserDto from '../dao/DTOs/users.dto.js'
import logger from './winston.config.js';
import { newUser as newUserMailing } from './nodemailer.config.js';

const LocalStrategy = local.Strategy;

const initializePassport = () =>{

//LOCAL
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',       
    }, async (req, username, password, done)=>{
            const { first_name, last_name, email, age } = req.body;
            
        try {
            const user = await userModel.findOne({ email: username });

            if(user) {
                console.log('El usuario ya existe');
                return done(null, false)
            }

            const newUser = {
                first_name, 
                last_name,
                email,
                age,
                carts:[],
                password: createHash(password),
                role: email.includes('admin') && password.includes('admin') ? 'admin' : 'user'
            };

            const result = await userModel.create( newUser );

            await newUserMailing(newUser.email, newUser.first_name);

            return done(null, result);

        } catch (error) {
           
            return done(`Error al registrar usuario, ${error}`);
        }
    } ));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) =>{
        try {
            const user = await userModel.findOne({ email: username });

            if (!user) {
                return done(null, false);
            };

            if(!isValidPassword(user, password)) {
                
                return done(null, false)
            };

            //Para calcular la ultima conexion:
            user.lastConnection = new Date();
            await userModel.findByIdAndUpdate(user._id, { lastConnection: user.lastConnection });

            if (user.carts.length === 0) {
                let newCart = await createCart();
                let userId = user._id.toString();

                await createCartUser(userId, newCart);
            }

            logger.info(`El usuario con el mail: ${user.email} inicio session`);
            
            return done(null, user);
            
        } catch (error) {
            logger.fatal(`${error}`);
            return done(`Error al loguear usuario, ${error}`);
        }
    }));

    
//GITHUB
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.4af316fb966c709f',
        clientSecret: 'c8c3ebba0faccfcbec467f1157a955375efeafa5',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        try {
            console.log(profile);

            const user = await userModel.findOne({ email: profile._json.email });

            if(!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: '' 
                };

                const result = await userModel.create(newUser);
                done(null, result);

            } else {
                done(null, user);
            }

        } catch (error) {
            done(error);
        }
    }));

    const JWTStrategy = jwt.Strategy;
    const ExtractJWT = jwt.ExtractJwt;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['cookieToken'];
        }
        
        return token;
    }

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            const userDto = new UserDto(jwt_payload.user)
            return done(null, userDto);
        } catch (error) {
            return done(error);
        }
    }))


    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done)=>{
        const user = await userModel.findById(id);
        done(null,user);
    })

}
export default initializePassport;