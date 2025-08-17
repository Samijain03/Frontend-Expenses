// src/components/TripForm.jsx

import { useState } from 'react';
import axios from 'axios';

function TripForm({ onTripCreated }) {
  // State to hold the value of the input field
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    // Prevent the default browser refresh on form submission
    e.preventDefault();
    
    // Simple validation to ensure the name isn't empty
    if (!name.trim()) {
      alert('Please enter a trip name.');
      return;
    }

    // Make a POST request to our API to create a new trip
    axios.post('http://127.0.0.1:8000/api/trips/', { name: name })
      .then(response => {
        console.log('Trip created:', response.data);
        // Call the function passed from App.jsx to update the trip list
        onTripCreated(response.data);
        // Clear the input field after successful submission
        setName(''); 
      })
      .catch(error => {
        console.error('There was an error creating the trip!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter new trip name (e.g., Paris Adventure)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" className="btn btn-success">Add Trip</button>
      </div>
    </form>
  );
}

export default TripForm;