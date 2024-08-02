import { usersManagerMongo } from "../DAL/dao/MongoDao/users.dao.js";

class UsersService {
  constructor() {}

  async findUsers() {
    const users = await usersManagerMongo.getUsers();
    return users;
  }

  async findUserById(uid) {
    const user = await usersManagerMongo.findUser(uid);
    return user;
  }

  async findUsersInactived(twoDaysAgo) {
    const users = await usersManagerMongo.getUsersInactived(twoDaysAgo);
    return users;
  }

  async deleteInactiveUsers(twoDaysAgo) {
    const deletedUsers = await usersManagerMongo.deleteInactiveUsers(
      twoDaysAgo
    );
    return deletedUsers;
  }

  async deleteUser(uid) {
    const user = await usersManagerMongo.deleteUser(uid);
    return user;
  }

  async updateUser(uid, obj) {
    const updatedUser = await usersManagerMongo.updateOne(
      { _id: uid },
      { ...obj }
    );
    return updatedUser;
  }
}

export const usersService = new UsersService();
