// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TripForm from '../components/TripForm';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function HomePage() {
  const [trips, setTrips] = useState([]);
  const { logout } = useAuth(); // Get the logout function

  // ... (useEffect and handleTripCreated are unchanged)
  useEffect(() => {
    axios.get('https://expense-tracker-moth.onrender.com/api/trips/')
      .then(response => {
        setTrips(response.data);
      })
      .catch(error => console.error('Error fetching trips:', error));
  }, []);

  const handleTripCreated = (newTrip) => {
    setTrips([...trips, newTrip]);
  };


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {/* Add a header with a logout button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">My Trips ✈️</h1>
            <button onClick={logout} className="btn btn-outline-danger">Logout</button>
          </div>
          
          <TripForm onTripCreated={handleTripCreated} />
          <ul className="list-group">
            {/* ... (rest of the component is unchanged) */}
            {trips.length === 0 && <li className="list-group-item">No trips found. Add one above!</li>}
            {trips.map(trip => (
              <Link key={trip.id} to={`/trip/${trip.id}`} className="list-group-item list-group-item-action">
                {trip.name}
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;