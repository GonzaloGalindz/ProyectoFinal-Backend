import { usersModel } from "../../MongoDB/models/users.model.js";

class UsersMongo {
  async getUsers() {
    try {
      const allUsers = await usersModel.find().lean();
      return allUsers;
    } catch (error) {
      return error;
    }
  }

  async getUsersInactived(twoDaysAgo) {
    try {
      const usersInactived = await usersModel.find({
        lastConnection: { $lt: twoDaysAgo },
      });
      return usersInactived;
    } catch (error) {
      return error;
    }
  }

  async deleteInactiveUsers(twoDaysAgo) {
    try {
      const users = await usersModel.deleteMany({
        lastConnection: { $lt: twoDaysAgo },
      });
      return users;
    } catch (error) {
      return error;
    }
  }

  async createUser(user) {
    try {
      const newUser = await usersModel.create(user);
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async findUser(data) {
    try {
      const user = await usersModel.findOne(data);
      return user;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(uid) {
    try {
      const user = await usersModel.findByIdAndDelete(uid);
      return user;
    } catch (error) {
      return error;
    }
  }

  async updateOne(uid, obj) {
    const updatedUser = await usersModel.updateOne({ _id: uid }, { ...obj });
    return updatedUser;
  }
}

export const usersManagerMongo = new UsersMongo();
