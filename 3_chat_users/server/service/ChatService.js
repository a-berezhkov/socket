const { Chat, User } = require("../db/models");
const { Op, or } = require("sequelize");
class ChatService {
  static async sendMessage(data) {
    try {
      return Chat.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async getMessagesInChat(fromId, toId) {
    try {
      return await Chat.findAll({
        where: {
          [Op.or]: [
            {
              fromId: fromId,
              toId: toId,
            },
            {
              fromId: toId,
              toId: fromId,
            },
          ],
        },
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: User,
            as: "sender",
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChatService;
