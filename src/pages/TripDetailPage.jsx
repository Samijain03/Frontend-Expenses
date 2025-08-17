// src/pages/TripDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BalanceSummary from '../components/BalanceSummary';
import MemberList from '../components/MemberList'; // Import
import AddMemberForm from '../components/AddMemberForm'; // Import

function TripDetailPage() {
    const [trip, setTrip] = useState(null);
    const { tripId } = useParams();

    const fetchTripData = () => {
        axios.get(`https://expense-tracker-moth.onrender.com/api/trips/${tripId}/`)
            .then(response => setTrip(response.data))
            .catch(error => console.error('HTTP fetch error:', error));
    };

    useEffect(() => {
        fetchTripData();
        const intervalId = setInterval(fetchTripData, 5000);
        return () => clearInterval(intervalId);
    }, [tripId]);

    if (!trip) return <div>Loading...</div>;

    return (
         <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">{trip.name}</h2>
                <div>
                    {/* ADD THIS SETTLE UP BUTTON */}
                    <Link to={`/trip/${tripId}/settle`} className="btn btn-success me-2">
                        Settle Up
                    </Link>
                    <Link to="/" className="btn btn-secondary">← Back to All Trips</Link>
                </div>
            </div>

            <div className="row g-5">
                <div className="col-lg-7">
                    <div className="mb-4"><BalanceSummary trip={trip} /></div>
                    <h4 className="mb-4">Trip Expenses 💵</h4>
                    <ExpenseList expenses={trip.expenses} />
                </div>
                <div className="col-lg-5">
                    <ExpenseForm 
    tripId={trip.id} 
    members={trip.members} // <-- PASS MEMBERS PROP
    onExpenseAdded={fetchTripData} 
/>
                    <div className="mt-4"><MemberList members={trip.members} /></div>
                    <div className="mt-4"><AddMemberForm tripId={trip.id} onMemberAdded={fetchTripData} /></div>
                </div>
            </div>
        </div>
    );
}

export default TripDetailPage;