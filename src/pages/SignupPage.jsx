// src/pages/SignupPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(username, password);
            navigate('/login');
        } catch (err)
{
            setError('Failed to create an account. Username may already be taken.');
            console.error(err);
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body p-4 p-sm-5">
                        <h2 className="card-title text-center mb-4 fs-2">Sign Up</h2>
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
                            <button type="submit" className="btn btn-success w-100 py-2">Sign Up</button>
                        </form>
                        <div className="text-center mt-3">
                            <p className="mb-0">Already have an account? <Link to="/login">Log In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
