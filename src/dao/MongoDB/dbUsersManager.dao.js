import userModel from './models/users.model.js';

export default class dbUsersManager {
    constructor(){}
    
    createUser = async (user) =>{
        return await userModel.create(user);
    }  

    getUser = async (email) =>{
        return await userModel.findOne({ email })
    };

    getUsers = async (limit, page, sort) =>{
        if (sort) {
            let sortOption = {};
            if (sort === "asc") {
                sortOption = { order: 'asc' };
            } else if (sort === "desc") {
                sortOption = { order: 'desc' };
            }
            sort = sortOption;
        };
        return await userModel.paginate({}, { limit, page, sort, lean: true });
    };

    getUserById = async (uid) =>{
        return await userModel.findOne({ _id: uid })
    };

    updateUserPass = async (email, user) =>{
        return await userModel.updateOne({ email }, user)
    };

    createCartUser = async (userId, newCart) =>{
        return await userModel.findByIdAndUpdate(userId, { $push: { carts: { _id: newCart._id } } });
    };

    deleteUser = async (id) =>{
        return await userModel.deleteOne({_id: id});
    };

    updateRole = async (email, role) =>{
        return await userModel.findOneAndUpdate({ email }, { role });
    };
};