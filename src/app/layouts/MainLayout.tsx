import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { GuestLayout } from './GuestLayout';
import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';
import { useStateContext } from '../providers/ContextProvider';

import './layout.scss';
import { currentUser } from '../../shared/api/endpoints/users';

export const MainLayout = () => {
    const { user, token, setUser } = useStateContext();

    useEffect(() => {
        if (token) {
            currentUser().then((data: any) => {
                setUser(data.data);
            });
        }
    }, [token]);

    if (!token) {
        return <GuestLayout />;
    }

    if (token && !user) {
        return <div className="loading">Загрузка пользователя...</div>;
    }

    return (
        <div>
            <Header isAuthenticated={true} />
            <Sidebar isAuthenticated={true} currentUser={user} />
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
};
