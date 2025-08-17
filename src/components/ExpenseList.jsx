// src/components/ExpenseList.jsx

function ExpenseList({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p className="text-muted">No expenses added yet. Be the first!</p>;
  }

  return (
    <ul className="list-group">
      {expenses.map(expense => (
        <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            {/* Show Category as the main title, and details if they exist */}
            <h6 className="my-0">{expense.category_display} {expense.details && `(${expense.details})`}</h6>
            <small className="text-muted">
              Paid by {expense.paid_by_username || 'user'} via <span className="fw-bold">{expense.payment_method}</span>
            </small>
          </div>
          <span className="badge bg-primary rounded-pill fs-6">₹{parseFloat(expense.amount).toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;