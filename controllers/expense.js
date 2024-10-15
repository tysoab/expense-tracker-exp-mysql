const Expense = require("../model/expense-mod");
const { numberFormat, convertToDeg, calAverage } = require("../util/helpers");
const { validationResult } = require("express-validator/lib");

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

  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (edit) {
    Expense.findByPk(expenseId)
      .then((expense) => {
        const { title, amount, merchant, description, category } = expense;
        res.render("expense/create", {
          path: "/expense",
          pageTitle: `Update ${title}`,
          expense: expense,
          errorMessage: message,
          oldInput: {
            title: title,
            amount: amount,
            merchant: merchant,
            description: description,
            category: category,
          },
          validationErrors: [],
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.render("expense/create", {
      path: "/expense",
      pageTitle: "New Expense",
      expense: null,
      errorMessage: message,
      oldInput: {
        title: "",
        amount: "",
        merchant: "",
        description: "",
        category: "",
      },
      validationErrors: [],
    });
  }
};

// post new expense
exports.postAddExpense = (req, res, next) => {
  const { title, merchant, amount, description, category } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.body.edit = true;
    return res.status(422).render("expense/create", {
      path: "/expense",
      pageTitle: "New Expense",
      expense: null,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: title,
        amount: amount,
        merchant: merchant,
        description: description,
        category: category,
      },
      validationErrors: errors.array(),
    });
  }

  // const isValidImage =
  //   (image && image.mimetype === "image/jpeg") ||
  //   image.mimetype === "image/jpg" ||
  //   image.mimetype === "image/png"
  //     ? true
  //     : false;

  if (image) {
    if (
      image.mimetype === "image/jpeg" ||
      image.mimetype === "image/jpg" ||
      image.mimetype === "image/png"
    )
      return res.status(422).render("expense/create", {
        path: "/expense",
        pageTitle: "New Expense",
        expense: null,
        errorMessage:
          "Attachment not supported, only jpg, jpeg, png files are supported",
        oldInput: {
          title: title,
          amount: amount,
          merchant: merchant,
          description: description,
          category: category,
        },
        validationErrors: [],
      });
  }

  const imageUrl = image ? image.path : "";

  Expense.create({
    title,
    merchant,
    amount,
    description,
    category,
    invoice: imageUrl,
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
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render("expense/create", {
      path: "/expense",
      pageTitle: `Update ${title}`,
      expense: {
        title: title,
        amount: amount,
        merchant: merchant,
        description: description,
        category: category,
        id: id,
      },
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: title,
        amount: amount,
        merchant: merchant,
        description: description,
        category: category,
        id: id,
      },
      validationErrors: errors.array(),
    });
  }

  Expense.findByPk(id)
    .then((expense) => {
      const imageUrl = image ? image.path : expense.invoice;
      expense.title = title;
      expense.merchant = merchant;
      expense.amount = amount;
      expense.description = description;
      expense.category = category;
      expense.invoice = imageUrl;

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
      // res.redirect("/expense");
      console.log(err);
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
