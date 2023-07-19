import { USERSDAO } from '../dao/index.js';

const saveUser = async (user) =>{
    await USERSDAO.createUser(user);
    return user;
};

const findUser = async (email) =>{
    const user = await USERSDAO.getUser(email);
    return user;
};

const getUserById = async (id) =>{
    const userId = await USERSDAO.getUserById(id);
    return userId;
}

const updateUserPass = async (email, user) =>{
    const update = await USERSDAO.updateUserPass(email, user);
    return update;
};

const createCartUser = async (userId, newCart) =>{
    const update = await USERSDAO.createCartUser(userId, newCart);
    return update;
};

const getUsers = async (limit, page, sort) =>{
    const users = await USERSDAO.getUsers(limit, page, sort);
    return users;
};

const cleanUsers = async (id) =>{
    const user = await USERSDAO.deleteUser(id);
    return user;
};

const updateRole = async (email, role) =>{
    const user = await USERSDAO.updateRole(email, role);
    return user;
};


export {
    saveUser,
    findUser,
    updateUserPass,
    getUserById,
    createCartUser,
    getUsers,
    cleanUsers,
    updateRole
}