const path = require("path");
const express = require("express");
const userController = require("../controllers/user");

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
router.post("/create", userController.postCreate);

router.post("/logout", userController.postLogout);

module.exports = router;
