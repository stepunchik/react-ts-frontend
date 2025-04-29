import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';

import './layout.scss';

export const MainLayout = () => {
    return (
        <div>
            <Header />
            <Sidebar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};
