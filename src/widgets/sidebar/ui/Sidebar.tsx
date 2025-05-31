import { Link } from 'react-router-dom';
import './sidebar.scss';

interface SidebarProps {
    isAuthenticated: boolean;
    currentUser?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ isAuthenticated, currentUser }) => {
    return (
        <nav className="sidebar">
            <div className="sidebar-block">
                <Link to="/" className="link">
                    Главная
                </Link>
            </div>
            {isAuthenticated && (
                <div className="sidebar-block">
                    <Link to="/conversations" className="link">
                        Диалоги
                    </Link>
                </div>
            )}
            {isAuthenticated && currentUser?.id && (
                <div className="sidebar-block">
                    <Link to={`/users/${currentUser.id}`} className="link">
                        Профиль
                    </Link>
                </div>
            )}
        </nav>
    );
};
