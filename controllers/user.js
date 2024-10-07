const UserMod = require("../model/user-mod");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/lib");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("user/login", {
    path: "/account/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: { email: "" },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // validate user input
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("user/login", {
      path: "/account/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email },
      validationErrors: errors.array(),
    });
  }

  UserMod.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(422).render("user/login", {
          path: "/account/login",
          pageTitle: "Login",
          errorMessage: "Record not found!",
          oldInput: { email: email },
          validationErrors: errors.array(),
        });
      }

      bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return res.redirect("/");
        }

        return res.status(422).render("user/login", {
          path: "/account/login",
          pageTitle: "Login",
          errorMessage: "Record not found!",
          oldInput: { email: email },
          validationErrors: errors.array(),
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.getCreate = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("user/create", {
    path: "/account/create",
    pageTitle: "Create Account",
    errorMessage: message,
    oldInput: { email: "" },
    validationErrors: [],
  });
};

exports.postCreate = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("user/create", {
      path: "/account/create",
      pageTitle: "Create Account",
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, firstName: firstName, lastName: lastName },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      UserMod.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      }).then((result) => {
        return res.redirect("/account/login");
      });
    })
    .catch((err) => console.log(err));
};

// logout
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/account/login");
  });
};
