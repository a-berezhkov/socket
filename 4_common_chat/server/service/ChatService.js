const { Chat } = require("../db/models");

class ChatService {
  /**
   * Получить все сообщения чата
   * @param {*} count - кол-во сообщений
   * @returns
   */
  static async getMessagesInChat(count = 50) {
    try {
      return Chat.findAll({
        limit: count,
        order: [["createdAt", "ASC"]],
        include: ["User"],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Добавить сообщение в чат
   * @param {*} data {userId, message}
   * @returns
   */
  static async addMessageToChat(data) {
    try {
      const chat = await Chat.create(data);
      return Chat.findByPk(chat.id, { include: ["User"] });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Удалить сообщение из чата
   * @param {*} id
   * @returns
   */
  static async deleteMessageFromChat(id) {
    try {
      const deletedMessage = await Chat.destroy({ where: { id } });
      if (!deletedMessage) {
        throw new Error("Message not found");
      }
      return id;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Обновить сообщение в чате
   * @param {*} id
   * @param {*} data
   * @returns
   */
  static async updateMessageInChat(id, data) {
    try {
      const chat = await Chat.update(data, { where: { id } });
      return Chat.findByPk(id, { include: ["User"] });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChatService;
