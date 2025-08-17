// src/components/Layout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
    return (
        <div>
            <Navbar />
            <main className="container my-4">
                <Outlet /> {/* Child routes will be rendered here */}
            </main>
        </div>
    );
}

export default Layout;