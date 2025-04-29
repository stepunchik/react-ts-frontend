import { Link } from 'react-router-dom';
import './sidebar.scss';

export const Sidebar = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-block">
                <Link to="/" className="link">
                    Главная
                </Link>
            </div>
            <div className="sidebar-block">
                <Link to="/conversations" className="link">
                    Диалоги
                </Link>
            </div>
            <div className="sidebar-block">
                <Link to="/profile" className="link">
                    Профиль
                </Link>
            </div>
        </nav>
    );
};
