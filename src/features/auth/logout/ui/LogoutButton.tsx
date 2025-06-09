import { Navigate } from 'react-router-dom';
import { useStateContext } from '@app/providers/ContextProvider';
import { logout } from '@shared/api/endpoints/logout';

interface LogoutButtonProps {
    style: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ style }) => {
    const { token, setUser, setToken } = useStateContext();

    if (!token) {
        return <Navigate to="/" />;
    }

    const handleLogout = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        try {
            await logout().then(() => {
                setUser({});
                setToken(null);
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleLogout} type="submit" className={style}>
            Выйти
        </button>
    );
};
