const path = require("path");
const express = require("express");
const expenseController = require("../controllers/expense");
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator/lib");

const router = express.Router();

router.get("/", isAuth, expenseController.getHome);
router.get("/expense/", isAuth, expenseController.getExpenses);
router.get("/expense/details/:id", isAuth, expenseController.getExpense);

router.get("/expense/create", isAuth, expenseController.getAddExpense);
router.post(
  "/expense/create",
  [
    body("title", "Please Enter the Title")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    body("merchant", "Please Enter the Merchant Name")
      .trim()
      .isString()
      .isLength({ min: 1 }),
    body("amount", "Please Enter the Amount")
      .trim()
      .isNumeric()
      .isLength({ min: 1 }),

    body("description", "Please Enter the Description")
      .trim()
      .isString()
      .isLength({ min: 1 }),
    body("category", "Select a Category")
      .trim()
      .custom((value, { req }) => {
        if (value === "") {
          throw new Error("Please Enter Category");
        }

        return true;
      }),
  ],
  isAuth,
  expenseController.postAddExpense
);
router.post(
  "/expense/update",
  [
    body("title", "Please Enter the Title")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    body("merchant", "Please Enter the Merchant Name")
      .trim()
      .isString()
      .isLength({ min: 1 }),
    body("amount", "Please Enter the Amount")
      .trim()
      .isNumeric()
      .isLength({ min: 1 }),
    body("description", "Please Enter the Description")
      .trim()
      .isString()
      .isLength({ min: 1 }),
    body("category")
      .trim()
      .custom((value, { req }) => {
        if (value === "") {
          throw new Error("Please Enter Category");
        }

        return true;
      }),
  ],
  isAuth,
  expenseController.postUpdateExpense
);

router.post(
  "/expense/delete-expense",
  isAuth,
  expenseController.postDeleteExpense
);

module.exports = router;
