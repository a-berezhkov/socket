const ChatService = require("../service/ChatService");

const getMessagesChat = async (req, res) => {
  try {
    const { fromId, toId } = req.body;
    const chats = await ChatService.getMessagesInChat(fromId, toId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessagesChat };
