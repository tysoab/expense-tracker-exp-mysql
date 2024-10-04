const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// controllers
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const errorController = require("./controllers/error");

// db connect and user & expense model
const sequelize = require("./util/database");
const ExpenseMod = require("./model/expense-mod");
const UserMod = require("./model/user-mod");
const session = require("express-session");
const flash = require("connect-flash");
const { where } = require("sequelize");

// create app
const app = express();

// set template engine
app.set("view engine", "ejs");
app.set("views", "views");

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
  session({
    secret: "my secrete",
    resave: false,
    saveUninitialized: false,
    // store: store,
  })
);

// register flash
app.use(flash());

// user middleware
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  UserMod.findOne({ where: { email: req.session.user.email } })
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// things common to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// use the controller
app.use(expenseRoutes);
app.use("/account", userRoutes);
app.use(errorController.get404);

// relations
const optional = { constraints: true, onDelete: "CASCADE" };
ExpenseMod.belongsTo(UserMod, optional);
UserMod.hasMany(ExpenseMod);

// sync sequelize
sequelize
  .sync()
  .then((result) => {
    console.log(result);
    // start the app
    app.listen(3003);
  })
  .catch((err) => {
    console.log(err);
  });
