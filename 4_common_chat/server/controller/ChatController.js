const ChatService = require("../service/ChatService");

const getMessagesChat = async (req, res) => {
  const countMessage = req.query.count ? Number(req.query.count) : 50;
  try {
    const messages = await ChatService.getMessagesInChat(countMessage);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessagesChat };
