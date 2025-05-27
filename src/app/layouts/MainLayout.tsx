import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { GuestLayout } from './GuestLayout';
import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';
import { useStateContext } from '../providers/ContextProvider';

import './layout.scss';
import { currentUser } from '../../shared/api/endpoints/users';
import { ForbiddenPage } from '../../pages/forbidden';

export const MainLayout = () => {
    const { user, token, setUser } = useStateContext();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (token) {
            currentUser().then((data: any) => {
                setUser(data.data);
            });
        }
    }, [token]);

    if (user.roles?.includes('admin')) {
        return <ForbiddenPage />;
    }

    if (!token) {
        return <GuestLayout />;
    }

    if (token && !user) {
        return <div className="loading">Загрузка пользователя...</div>;
    }

    return (
        <div>
            <Header isAuthenticated={true} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Sidebar isAuthenticated={true} currentUser={user} />
            <main className="main">
                <Outlet context={{ searchTerm }} />
            </main>
        </div>
    );
};
