import { ticketsService } from "../services/tickets.service.js";
import { generatorUniqueCode } from "../DAL/dao/MongoDao/tickets.dao.js";

class TicketsController {
  constructor() {}

  async createTicket(req, res) {
    const { code, purchase_datetime, amount, purchaser } = req.body;
    try {
      code = generatorUniqueCode();
      const ticket = await ticketsService.createTicket({
        code,
        purchase_datetime,
        amount,
        purchaser,
      });
      res.status(200).json({ ticket });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const ticketsController = new TicketsController();
