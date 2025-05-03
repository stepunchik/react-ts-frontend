import { Link } from 'react-router-dom';
import './sidebar.scss';

interface SidebarProps {
    isAuthenticated: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isAuthenticated }) => {
    return (
        <nav className="sidebar">
            <div className="sidebar-block">
                <Link to="/" className="link">
                    Главная
                </Link>
            </div>
            { isAuthenticated &&
                <div className="sidebar-block">
                    <Link to="/conversations" className="link">
                        Диалоги
                    </Link>
                </div>
            }
            { isAuthenticated &&
                <div className="sidebar-block">
                    <Link to="/profile" className="link">
                        Профиль
                    </Link>
                </div>
            }
        </nav>
    );
};
