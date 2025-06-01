import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../app/providers/ContextProvider';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { deleteUser } from '../../../shared/api/endpoints/users';

import './settings.scss';

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { user, setUser, setToken } = useStateContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openDeleteModal = () => {
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        deleteUser(user.id)
            .then(() => {
                setUser({});
                setToken(null);
                navigate('/');
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsModalOpen(false);
            });
    };

    return (
        <div className="settings-block">
            <Link to={`/users/${user.id}/edit`} className="settings-item">
                Данные аккаунта
            </Link>
            <div onClick={openDeleteModal} className="settings-item">
                Удалить аккаунт
            </div>

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Подтверждение удаления"
                className="modal delete-modal">
                <h2>Удалить аккаунт?</h2>
                <p>Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.</p>
                <div className="modal-buttons">
                    <button onClick={confirmDelete} className="confirm-btn">
                        Удалить
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
                        Отмена
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};
