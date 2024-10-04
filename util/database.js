// sequelize to manage db connection
const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-tracker", "root", "tysoab", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

module.exports = sequelize;
