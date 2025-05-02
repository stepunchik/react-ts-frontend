import { useState } from 'react';
import ReactModal from 'react-modal';
import { LoginDialog } from '../../login-dialog';

import './header.scss';

ReactModal.setAppElement('#root');

interface HeaderProps {
    isGuestLayout: boolean
}

export const Header: React.FC<HeaderProps> = ({ isGuestLayout }) => {
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    const openLoginDialog = () => setIsLoginDialogOpen(true);
    const closeLoginDialog = () => setIsLoginDialogOpen(false);

    return (
        <header className="header">
            <input type="text" className="search-field" />
            { isGuestLayout &&
                <button onClick={openLoginDialog} className="header-button">
                    Войти
                </button>
            }
            <ReactModal
                isOpen={isLoginDialogOpen}
                onRequestClose={closeLoginDialog}
                className="modal">
                <LoginDialog />
            </ReactModal>
        </header>
    );
};
