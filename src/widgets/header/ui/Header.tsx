import { useState } from 'react';
import ReactModal from 'react-modal';
import { LoginDialog } from '../../login-dialog';
import { Search } from '../../../features/search/ui/Search';

import './header.scss';
import { Link } from 'react-router-dom';

ReactModal.setAppElement('#root');

interface HeaderProps {
    isAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    const openLoginDialog = () => setIsLoginDialogOpen(true);
    const closeLoginDialog = () => setIsLoginDialogOpen(false);

    return (
        <header className="header">
            <Search />
            {isAuthenticated && (
                <Link to="/publications/create" className="header-button">
                    Создать
                </Link>
            )}
            {!isAuthenticated && (
                <button onClick={openLoginDialog} className="header-button">
                    Войти
                </button>
            )}
            <ReactModal
                isOpen={isLoginDialogOpen}
                onRequestClose={closeLoginDialog}
                className="modal">
                <LoginDialog onClose={closeLoginDialog} />
            </ReactModal>
        </header>
    );
};
