import { ticketsModel } from "../../MongoDB/models/tickets.model.js";

class TicketsMongo {
  constructor() {}

  async createTicket(ticketData) {
    const newTicket = new ticketsModel(ticketData);
    await newTicket.save();
    return newTicket;
  }
}

async function generatorUniqueCode() {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = generateRandomCode();
    const existingTicket = await ticketsModel.findOne({ code: uniqueCode });
    if (!existingTicket) {
      isUnique = true;
    }
  }
  return uniqueCode;
}

function generateRandomCode() {
  return "CODE-" + Math.random().toString(36);
}

export const ticketsManagerMongo = new TicketsMongo();
export { generatorUniqueCode };
