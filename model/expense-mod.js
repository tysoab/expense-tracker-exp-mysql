const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expense = sequelize.define("expense", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  merchant: Sequelize.STRING,
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: Sequelize.TEXT,
  category: Sequelize.STRING,
});

module.exports = Expense;
