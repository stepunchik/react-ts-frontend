import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div>
            <header>
                <nav>
                    <a href="/">Feed</a>
                    <a href="/profile">Profile</a>
                    <a href="/sign-in">Sign In</a>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};
