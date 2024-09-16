"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "fromId",
        as: "sender"
      });
      this.belongsTo(models.User, {
        foreignKey: "toId",
         as: "receiver"
      });
    }
  }
  Chat.init(
    {
      fromId: DataTypes.INTEGER,
      toId: DataTypes.INTEGER,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
