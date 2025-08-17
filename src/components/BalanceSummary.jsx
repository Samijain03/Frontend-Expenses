// src/components/BalanceSummary.jsx

import { useMemo } from 'react';

function BalanceSummary({ trip }) {
  const balances = useMemo(() => {
    if (!trip || !trip.members || !trip.expenses) {
        return {};
    }

    const memberBalances = {};

    trip.members.forEach(member => {
      memberBalances[member.username] = 0;
    });

    trip.expenses.forEach(expense => {
      const payerUsername = expense.paid_by_username;
      
      if (memberBalances[payerUsername] !== undefined) {
        memberBalances[payerUsername] += parseFloat(expense.amount);
      }
      
      // ** THE FIX IS HERE **
      // Add a check to make sure the splits array exists before looping
      if (expense.splits && Array.isArray(expense.splits)) {
        expense.splits.forEach(split => {
          const owedByUsername = split.owed_by_username;
          if (memberBalances[owedByUsername] !== undefined) {
            memberBalances[owedByUsername] -= parseFloat(split.amount_owed);
          }
        });
      }
    });

    return memberBalances;
  }, [trip]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-4">Trip Balances 📊</h4>
        <ul className="list-group list-group-flush">
          {Object.entries(balances).map(([username, balance]) => (
            <li key={username} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{username}</span>
              {Math.abs(balance) < 0.01 ? (
                <span className="text-muted">Settled</span>
              ) : balance > 0 ? (
                <span className="text-success fw-bold">Is owed ₹{balance.toFixed(2)}</span>
              ) : (
                <span className="text-danger">Owes ₹{Math.abs(balance).toFixed(2)}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BalanceSummary;