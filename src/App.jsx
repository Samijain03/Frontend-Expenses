// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TripDetailPage from './pages/TripDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettleUpPage from './pages/SettleUpPage'; // <-- Import the new page

function App() {
    const { authToken } = useAuth();
    
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={authToken ? <Navigate to="/" /> : <LoginPage />} />
                <Route path="/signup" element={authToken ? <Navigate to="/" /> : <SignupPage />} />

                {/* Private routes using the Layout */}
                <Route path="/" element={authToken ? <Layout /> : <Navigate to="/login" />}>
                    <Route index element={<HomePage />} />
                    <Route path="trip/:tripId" element={<TripDetailPage />} />
                    <Route path="trip/:tripId/settle" element={<SettleUpPage />} /> {/* <-- Add this route */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;