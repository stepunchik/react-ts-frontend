import { Link } from 'react-router-dom';
import './sidebar.scss';

interface SidebarProps {
    isGuestLayout: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isGuestLayout }) => {
    return (
        <nav className="sidebar">
            <div className="sidebar-block">
                <Link to="/" className="link">
                    Главная
                </Link>
            </div>
            { !isGuestLayout &&
                <div className="sidebar-block">
                    <Link to="/conversations" className="link">
                        Диалоги
                    </Link>
                </div>
            }
            { !isGuestLayout &&
                <div className="sidebar-block">
                    <Link to="/profile" className="link">
                        Профиль
                    </Link>
                </div>
            }
        </nav>
    );
};
