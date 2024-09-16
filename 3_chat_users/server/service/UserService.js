const { User, Chat } = require("../db/models");
const { Op, Sequelize } = require("sequelize");
class UserService {
  static async getUserById(id) {
    try {
      return User.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

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

  static async updateUser(id, data) {
    try {
      const user = await User.findByPk(id);
      if (user) {
        return user.update(data);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        return user;
      }
      return null;
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

  static async getUserChats(id) {
    try {
      const user = await User.findByPk(id, {
        include: ["from", "to"],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserChatsWith(id, toId) {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            association: "from",
            where: { toId },
          },
          {
            association: "to",
            where: { fromId: toId },
          },
        ],
      });
      return user;
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
