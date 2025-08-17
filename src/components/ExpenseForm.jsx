// src/components/ExpenseForm.jsx

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SplitForm from './SplitForm';

const CATEGORIES = [
  { value: 'FOOD', label: 'Food' },
  { value: 'TAXI', label: 'Taxi' },
  { value: 'METRO', label: 'Metro' },
  { value: 'TICKETS', label: 'Entry Tickets' },
  { value: 'ACCOMMODATION', label: 'Accommodation' },
  { value: 'OTHER', label: 'Other' },
];

function ExpenseForm({ tripId, members, onExpenseAdded }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [details, setDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [splits, setSplits] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (amount > 0 && splits.length === 0 && members && members.length > 0) {
      // ** THE FIX IS HERE **
      // Instead of calculating an equal split, set the initial amount to 0.
      setSplits(members.map(member => ({
        owed_by: member.id,
        username: member.username,
        amount_owed: '0.00' 
      })));
    } else if (!amount || amount <= 0) {
      setSplits([]);
    }
  }, [amount, members]);

  const handleSplitsChange = useCallback((newSplits) => {
    setSplits(newSplits);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const numericSplits = splits.map(s => ({...s, amount_owed: parseFloat(s.amount_owed) || 0}));
    const totalSplitAmount = numericSplits.reduce((acc, s) => acc + s.amount_owed, 0);

    if (Math.abs(parseFloat(amount) - totalSplitAmount) > 0.01) {
        setError(`The total split (₹${totalSplitAmount.toFixed(2)}) must match the expense amount (₹${amount}).`);
        return;
    }

    setIsSubmitting(true);
    const expenseData = {
      trip: tripId,
      amount: parseFloat(amount),
      category,
      details,
      payment_method: paymentMethod,
      splits: numericSplits.map(({ owed_by, amount_owed }) => ({ owed_by, amount_owed })),
    };

    axios.post('http://127.0.0.1:8000/api/expenses/', expenseData)
      .then(response => {
        onExpenseAdded();
        setAmount('');
        setCategory('FOOD');
        setDetails('');
        setPaymentMethod('UPI');
        setSplits([]);
      })
      .catch(err => setError(err.response?.data[0] || 'Failed to add expense.'))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select id="category" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="details" className="form-label">Details (Optional)</label>
          <input type="text" className="form-control" id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g., Lunch, Auto rickshaw" />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount (₹)</label>
          <input type="number" step="0.01" className="form-control" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>
        <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <div className="form-check"><input className="form-check-input" type="radio" name="paymentMethod" id="upiRadio" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} /><label className="form-check-label" htmlFor="upiRadio">UPI</label></div>
            <div className="form-check"><input className="form-check-input" type="radio" name="paymentMethod" id="cashRadio" value="CASH" checked={paymentMethod === 'CASH'} onChange={(e) => setPaymentMethod(e.target.value)} /><label className="form-check-label" htmlFor="cashRadio">Cash</label></div>
        </div>

        {amount > 0 && members && (
            <SplitForm 
                members={members} 
                totalAmount={parseFloat(amount) || 0}
                splits={splits}
                onSplitsChange={handleSplitsChange}
            />
        )}
      
      <button type="submit" className="btn btn-success w-100 mt-4" disabled={isSubmitting || !amount}>
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
}

export default ExpenseForm;