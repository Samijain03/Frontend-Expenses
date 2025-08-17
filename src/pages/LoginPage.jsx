// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body p-4 p-sm-5">
                        <h2 className="card-title text-center mb-4 fs-2">Log In</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2">Log In</button>
                        </form>
                        <div className="text-center mt-3">
                            <p className="mb-0">Need an account? <Link to="/signup">Sign Up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
