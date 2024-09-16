const router = require("express").Router();
const AuthController = require("../../controller/AuthController");

router
  .post("/registration", AuthController.registration)
  .post("/authorization", AuthController.authorization)
  .delete("/logout", AuthController.logout);

module.exports = router;
