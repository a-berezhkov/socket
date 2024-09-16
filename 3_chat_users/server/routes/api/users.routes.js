require("dotenv").config();
const router = require("express").Router();
const UserController = require("../../controller/UserController");
const verifyAccessToken = require("../../middleware/verifyAccessToken");

router.get("/chats", verifyAccessToken, UserController.getMyChats);

if (process.env.NODE_ENV === "development") {
  router.get("/users", UserController.getAllUsers);
}

module.exports = router;
