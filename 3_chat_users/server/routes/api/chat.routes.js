const router = require("express").Router();
const ChatController = require("../../controller/ChatController");

router.post("/messages", ChatController.getMessagesChat);

module.exports = router;
