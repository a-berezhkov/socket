require("dotenv").config();
const router = require("express").Router();
const UserController = require("../../controller/UserController");

if (process.env.NODE_ENV === "development") {
  router.get("/users", UserController.getAllUsers);
}

module.exports = router;
