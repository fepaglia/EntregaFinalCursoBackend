import { Router } from 'express';

import { 
    changePass,
    createUser,
    logOut,
    login,
    github,
    githubCallback,
    failLogin,
    failRegister,
    current
} from '../../controllers/users.controller.js';
import passport from 'passport';

const router = Router();

router.post('/login',passport.authenticate('login', {failureRedirect: 'fail-login'}), login);

router.get('/fail-login', failLogin );

router.post('/register', passport.authenticate('register', {failureRedirect: 'fail-register'}), createUser);

router.get('/fail-register', failRegister);

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), github);

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),  githubCallback);

router.get('/current', passport.authenticate("current", {session: false}), current)

router.post('/reset', changePass);

router.get('/logout', logOut);

export default router;