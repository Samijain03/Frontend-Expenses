// src/pages/SettleUpPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function SettleUpPage() {
    const [trip, setTrip] = useState(null);
    const { tripId } = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/trips/${tripId}/`)
            .then(response => setTrip(response.data))
            .catch(error => console.error('HTTP fetch error:', error));
    }, [tripId]);

    // This is the core algorithm for calculating the settlement plan
    const settlementPlan = useMemo(() => {
        if (!trip || !trip.members || !trip.expenses) return [];

        const memberBalances = {};
        trip.members.forEach(m => { memberBalances[m.username] = 0; });

        trip.expenses.forEach(expense => {
            const payer = expense.paid_by_username;
            if (memberBalances[payer] !== undefined) {
                memberBalances[payer] += parseFloat(expense.amount);
            }
            if (expense.splits) {
                expense.splits.forEach(split => {
                    const owedBy = split.owed_by_username;
                    if (memberBalances[owedBy] !== undefined) {
                        memberBalances[owedBy] -= parseFloat(split.amount_owed);
                    }
                });
            }
        });

        const debtors = [];
        const creditors = [];
        Object.entries(memberBalances).forEach(([username, balance]) => {
            if (balance > 0) creditors.push({ username, amount: balance });
            if (balance < 0) debtors.push({ username, amount: Math.abs(balance) });
        });

        const transactions = [];
        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];
            const amount = Math.min(debtor.amount, creditor.amount);

            if (amount > 0.01) { // Only record meaningful transactions
                transactions.push({ from: debtor.username, to: creditor.username, amount: amount.toFixed(2) });
            }

            debtor.amount -= amount;
            creditor.amount -= amount;

            if (debtor.amount < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }
        return transactions;
    }, [trip]);

    if (!trip) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">Settle Up for "{trip.name}"</h2>
                    <p className="text-muted">The simplest way to clear all debts.</p>
                </div>
                <Link to={`/trip/${tripId}`} className="btn btn-secondary">← Back to Trip</Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {settlementPlan.length === 0 ? (
                        <p className="text-center text-success fw-bold">All debts are settled! ✅</p>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {settlementPlan.map((txn, index) => (
                                <li key={index} className="list-group-item text-center fs-5">
                                    <strong>{txn.from}</strong> should pay <strong>{txn.to}</strong>
                                    <span className="text-primary fw-bold ms-2">₹{txn.amount}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SettleUpPage;