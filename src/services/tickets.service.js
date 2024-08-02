import { ticketsManagerMongo } from "../DAL/dao/MongoDao/tickets.dao.js";

class TicketsService {
  constructor() {}

  async createTicket(ticketData) {
    const newTicket = await ticketsManagerMongo.createTicket(ticketData);
    return newTicket.toJSON();
  }
}

export const ticketsService = new TicketsService();
