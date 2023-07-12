import ticketModel  from "./models/ticket.model.js";

export default class dbTicketManager {
    constructor() {
    console.log("Working tickets with DB in mongoDB");
    }

    createTicket = async (ticket) => {
        return await ticketModel.create(ticket)
    };

    findTicketById = async (tid) => {
        return await ticketModel.findOne({ _id: tid });
    };

    findTicketByCode = async (code) => {
        return await ticketModel.findOne({ code });
    };

    updateTicket = async (code, ticket) =>{
        return await ticketModel.updateOne({ code }, ticket);
    };

    deleteTicket = async (tid) => {
        return await ticketModel.deleteOne({ _id: tid })
    };
};