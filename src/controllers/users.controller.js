import UsersDto from "../DAL/dto/users.dto.js";
import { usersService } from "../services/users.service.js";
import { transporter } from "../nodemailer.js";

export const getUsers = async (req, res) => {
  try {
    const users = await usersService.findUsers();
    const usersDTOs = users.map((user) => new UsersDto(user));
    res.status(200).json({ message: "Users", response: usersDTOs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 172800000);

    const users = await usersService.findUsersInactived(twoDaysAgo);

    for (const user of users) {
      const messageOpt = {
        from: "gonzagalin777@gmail.com",
        to: user.email,
        subject: "WE HAVE DELETED YOUR ACCOUNT DUE TO INACTIVITY",
        text: "We delete your account due to lack of activity, you must create a new user to continue accessing our platform.",
      };
      await transporter.sendMail(messageOpt);
    }

    if (users.length > 0) {
      const deletedUsers = await usersService.deleteInactiveUsers(twoDaysAgo);
    }

    res.status(200).json({
      message: "Users removed due to inactivity",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    const userDeleted = await usersService.deleteUser(uid);
    if (!userDeleted) {
      res.status(404).json({ message: "User not found with this id" });
    }
    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoleUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const updatedUser = await usersService.updateUser(uid, req.body);
    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
