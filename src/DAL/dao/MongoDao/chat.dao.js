import { messagesModel } from "../../MongoDB/models/messages.model.js";

class ChatMongo {
  async findAll() {
    try {
      const messages = await messagesModel.find({});
      return messages;
    } catch (error) {
      return error;
    }
  }

  async createOne(obj) {
    try {
      const message = await messagesModel.create(obj);
      return message;
    } catch (error) {
      return error;
    }
  }
}

export const chatManagerMongo = new ChatMongo();
