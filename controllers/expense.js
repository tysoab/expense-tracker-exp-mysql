const Expense = require("../model/expense-mod");
const { numberFormat, convertToDeg, calAverage } = require("../util/helpers");

exports.getHome = (req, res, next) => {
  let total = 0;
  let maximum = 0;
  let average = 0;
  Expense.findAll({ where: { userId: +req.user.id } })
    .then((expenses) => {
      if (expenses) {
        total = expenses.reduce((acc, curr) => acc + +curr.amount, 0);
        const exps = expenses.map((exp) => +exp.amount);
        maximum = exps.length ? Math.max(...exps) : 0;
        average = exps.length
          ? exps.reduce((acc, curr) => acc + curr, 0) / exps.length
          : 0;

        const degTot = total
          ? convertToDeg(total, [total, maximum, average])
          : 0;
        const degMax = maximum
          ? convertToDeg(maximum, [total, maximum, average])
          : 0;
        const degAve = average
          ? convertToDeg(average, [total, maximum, average])
          : 0;

        const aveTot = total ? calAverage(total, [total, maximum, average]) : 0;
        const aveMax = maximum
          ? calAverage(maximum, [total, maximum, average])
          : 0;
        const aveAvg = average
          ? calAverage(average, [total, maximum, average])
          : 0;

        res.render("index", {
          path: "/",
          pageTitle: "Expense Tracker",
          totalExp: total,
          maximumExp: maximum,
          averageExp: average,
          degTot: degTot,
          degMax: degMax,
          degAve: degAve,
          aveTot: aveTot,
          aveMax: aveMax,
          aveAvg: aveAvg,
          nformat: numberFormat,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// get add expense
exports.getAddExpense = (req, res, next) => {
  const expenseId = req.query.id;
  const edit = req.query.edit;

  if (edit) {
    Expense.findByPk(expenseId)
      .then((expense) => {
        res.render("expense/create", {
          path: "/expense",
          pageTitle: `Update ${expense.title}`,
          expense: expense,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.render("expense/create", {
      path: "/expense",
      pageTitle: "New Expense",
      expense: null,
    });
  }
};

// post new expense
exports.postAddExpense = (req, res, next) => {
  const { title, merchant, amount, description, category } = req.body;
  Expense.create({
    title,
    merchant,
    amount,
    description,
    category,
    userId: +req.user.id,
  })
    .then((result) => {
      res.redirect("/expense");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postUpdateExpense = (req, res, next) => {
  const { title, merchant, amount, description, category, id } = req.body;
  Expense.findByPk(id)
    .then((expense) => {
      expense.title = title;
      expense.merchant = merchant;
      expense.amount = amount;
      expense.description = description;
      expense.category = category;

      return expense.save();
    })
    .then((result) => {
      res.redirect("/expense");
    })
    .catch((err) => console.log(err));
};

// Expense listings...
exports.getExpenses = (req, res, next) => {
  Expense.findAll({ where: { userId: +req.user.id }, order: [["id", "DESC"]] })
    .then((expenses) => {
      if (expenses) {
        total = expenses.reduce((acc, curr) => acc + +curr.amount, 0);
        const exps = expenses.map((exp) => +exp.amount);
        maximum = exps.length ? Math.max(...exps) : 0;
        average = exps.length
          ? exps.reduce((acc, curr) => acc + curr, 0) / exps.length
          : 0;

        res.render("expense/index", {
          path: "/expense",
          pageTitle: "All Expense",
          totalExp: total,
          maximumExp: maximum,
          averageExp: average,
          expenses: expenses,
          nformat: numberFormat,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getExpense = (req, res, next) => {
  const expenseId = req.params.id;
  Expense.findByPk(expenseId)
    .then((expense) => {
      res.render("expense/show", {
        path: "/expense",
        pageTitle: expense.title,
        expense: expense,
        nformat: numberFormat,
      });
    })
    .catch((err) => {
      res.redirect("/expense");
      // console.log(err);
    });
};

// delete expense
exports.postDeleteExpense = (req, res, next) => {
  const expenseId = req.body.id;

  Expense.findByPk(expenseId)
    .then((expense) => {
      return expense.destroy();
    })
    .then((result) => {
      res.redirect("/expense");
    })
    .catch((err) => console.log(err));
};
