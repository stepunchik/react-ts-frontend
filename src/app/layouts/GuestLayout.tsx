import { useState } from 'react';
import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';
import { Outlet } from 'react-router-dom';

import './layout.scss';

export const GuestLayout = () => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div>
            <Header isAuthenticated={false} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Sidebar isAuthenticated={false} />
            <main className="main">
                <Outlet context={{ searchTerm }} />
            </main>
        </div>
    );
};
