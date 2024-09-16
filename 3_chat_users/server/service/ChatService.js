const { Chat, User } = require("../db/models");
const { Op } = require("sequelize");
class ChatService {
  static async getChatsByUserId(id) {
    try {
      return Chat.findAll({
        where: {
          fromId: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getChatById(id) {
    try {
      return Chat.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  static async sendMessage(data) {
    try {
      return Chat.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async updateMessage(id, data) {
    try {
      const chat = await Chat.findByPk(id);
      if (chat) {
        return chat.update(data);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMessage(id) {
    try {
      const chat = await Chat.findByPk(id);
      if (chat) {
        await chat.destroy();
        return chat;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getAllChats() {
    try {
      return await Chat.findAll();
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
