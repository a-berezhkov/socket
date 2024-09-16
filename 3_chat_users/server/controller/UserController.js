const UserService = require("../service/UserService");

const getMyChats = async (req, res) => {
  try {
    const { id } = res.locals.user;
    const chats = await UserService.getUniqueUsersChats(id);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getMyChats ,getAllUsers };
