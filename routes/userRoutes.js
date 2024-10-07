const path = require("path");
const express = require("express");
const userController = require("../controllers/user");
const UserMod = require("../model/user-mod");

const { check, body } = require("express-validator/lib");

const router = express.Router();

router.get("/login", userController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Record not found!").isAlphanumeric().trim(),
  ],
  userController.postLogin
);

router.get("/create", userController.getCreate);
router.post(
  "/create",
  [
    body("firstName", "Please enter your first name")
      .isString()
      .trim()
      .isLength({ min: 3 }),
    body("lastName", "Please enter your last name")
      .isString()
      .trim()
      .isLength({ min: 3 }),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail()
      .custom((value, { req }) => {
        return UserMod.findOne({ where: { email: value } }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email Address already exist!, try a new Email Address."
            );
          }
        });
      }),
    body("password", "Password must be more 3 length")
      .isAlphanumeric()
      .trim()
      .isLength({ min: 4 }),
  ],
  userController.postCreate
);

router.post("/logout", userController.postLogout);

module.exports = router;
