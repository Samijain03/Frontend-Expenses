// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { authUser, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    SplitIt 💸
                </Link>
                <div className="d-flex align-items-center">
                    {authUser && (
                        <>
                            <span className="navbar-text me-3">
                                Welcome, <strong>{authUser}</strong>
                            </span>
                            <button onClick={logout} className="btn btn-outline-danger">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;