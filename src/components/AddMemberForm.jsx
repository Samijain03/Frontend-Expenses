// src/components/AddMemberForm.jsx

import { useState } from 'react';
import axios from 'axios';

function AddMemberForm({ tripId, onMemberAdded }) {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
        // Change 'add_member' to 'add-member' in this line
        const response = await axios.post(`https://expense-tracker-moth.onrender.com/api/trips/${tripId}/add-member/`, { username });
        setMessage(response.data.success || 'Member added!');
        setUsername('');
        onMemberAdded(); // Refresh the trip data
    } catch (err) {
        setMessage(err.response?.data?.error || 'Failed to add member.');
    }
};

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-body">
                <h5 className="card-title mb-3">Add Friend to Trip</h5>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-outline-primary">Add</button>
                    </div>
                </form>
                {message && <p className="mt-3">{message}</p>}
            </div>
        </div>
    );
}

export default AddMemberForm;