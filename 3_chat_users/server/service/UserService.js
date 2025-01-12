const { User, Chat } = require("../db/models");
const { Op, Sequelize } = require("sequelize");
class UserService {
  static async getUserByEmail(email) {
    try {
      return User.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  static async createUser(data) {
    try {
      return User.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      return User.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async getUniqueUsersChats(userId) {
    try {
      const chats = await Chat.findAll({
        where: {
          fromId: userId,
        },
      });
      const uniqueUserIds = chats.map((chat) => chat.toId);

      const users = await User.findAll({
        where: {
          id: {
            [Op.in]: Array.from(new Set(uniqueUserIds)),
          },
        },
        attributes: ["id", "name", "email"],
      });
      return users;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = UserService;
