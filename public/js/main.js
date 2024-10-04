const deleteExpense = document.querySelectorAll(".delete-expense");

deleteExpense &&
  deleteExpense.forEach((deleteBtn) => {
    deleteBtn.addEventListener("submit", (e) => {
      e.preventDefault();
      const confirmDelete = confirm("Are you sure, you want to delete this!");
      if (confirmDelete) {
        deleteBtn.submit();
      }
    });
  });
