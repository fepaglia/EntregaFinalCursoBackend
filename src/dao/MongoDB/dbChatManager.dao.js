import messageModel from './models/message.model.js'

export default class dbChatManager{
    constructor() {
        console.log('Working messages with DB on mongoDB')
    }

    getMessages = async () => {
        const messages = await messageModel.find()
        return messages
    };

    addMessage = async (user, message) => {
        const result = await messageModel.create({user, message})
        return result
    };
};