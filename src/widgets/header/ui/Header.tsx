import { useState } from 'react';
import ReactModal from 'react-modal';
import { LoginDialog } from '../../login-dialog';

import './header.scss';

export const Header = () => {
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    const openLoginDialog = () => setIsLoginDialogOpen(true);
    const closeLoginDialog = () => setIsLoginDialogOpen(false);

    return (
        <header className="header">
            <input type="text" className="search-field" />
            <button onClick={openLoginDialog} className="header-button">
                Войти
            </button>
            <ReactModal
                isOpen={isLoginDialogOpen}
                onRequestClose={closeLoginDialog}
                className="modal">
                <LoginDialog />
            </ReactModal>
        </header>
    );
};
