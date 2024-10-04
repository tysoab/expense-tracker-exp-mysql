const path = require("path");
const express = require("express");
const expenseController = require("../controllers/expense");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, expenseController.getHome);
router.get("/expense/", isAuth, expenseController.getExpenses);
router.get("/expense/details/:id", isAuth, expenseController.getExpense);

router.get("/expense/create", isAuth, expenseController.getAddExpense);
router.post("/expense/create", isAuth, expenseController.postAddExpense);
router.post("/expense/update", isAuth, expenseController.postUpdateExpense);

router.post(
  "/expense/delete-expense",
  isAuth,
  expenseController.postDeleteExpense
);

module.exports = router;
