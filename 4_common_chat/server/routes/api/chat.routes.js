const router = require("express").Router();
const ChatController = require("../../controller/ChatController");

router.get("/messages", ChatController.getMessagesChat);

module.exports = router;
