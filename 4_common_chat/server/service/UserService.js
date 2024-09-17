const { User, Chat } = require("../db/models");
const { Op, Sequelize } = require("sequelize");
class UserService {
  static async getUserByEmail(email) {
    try {
      return User.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  static async createUser(data) {
    try {
      return User.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      return User.findAll();
    } catch (error) {
      throw error;
    }
  }
}
module.exports = UserService;
