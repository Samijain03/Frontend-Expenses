// src/components/SplitForm.jsx

import { useEffect, useMemo } from 'react';

function SplitForm({ members, totalAmount, splits, onSplitsChange }) {

    // Calculate the current total of the splits
    const splitTotal = useMemo(() => {
        return splits.reduce((acc, split) => acc + (parseFloat(split.amount_owed) || 0), 0);
    }, [splits]);

    const handleAmountChange = (index, value) => {
        const newSplits = [...splits];
        newSplits[index].amount_owed = value;
        onSplitsChange(newSplits);
    };

    const handleSplitEqually = () => {
        if (members.length === 0 || totalAmount <= 0) return;
        const amountPerPerson = (totalAmount / members.length).toFixed(2);
        const newSplits = splits.map(split => ({
            ...split,
            amount_owed: amountPerPerson,
        }));
        onSplitsChange(newSplits);
    };
    
    const remainingAmount = (totalAmount - splitTotal).toFixed(2);

    return (
        <div className="mt-4 p-3 border rounded bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Split the Bill</h5>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleSplitEqually}>
                    Split Equally
                </button>
            </div>

            {splits.map((split, index) => (
                <div key={split.owed_by} className="input-group input-group-sm mb-2">
                    <span className="input-group-text" style={{ width: '50%' }}>{split.username}</span>
                    <span className="input-group-text">₹</span>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={split.amount_owed}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                    />
                </div>
            ))}
            
            <div className={`text-end mt-2 fw-bold ${remainingAmount != 0 ? 'text-danger' : 'text-success'}`}>
                Remaining: ₹{remainingAmount}
            </div>
        </div>
    );
}

export default SplitForm;