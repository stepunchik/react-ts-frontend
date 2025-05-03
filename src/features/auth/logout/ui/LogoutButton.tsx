import { useStateContext } from '/src/app/providers/ContextProvider';
import { logout } from '/src/shared/api/endpoints/logout';
import { Navigate } from 'react-router-dom';

export const LogoutButton = () => {
	const { user, token, setUser, setToken } = useStateContext();

	if (!token) {
		return <Navigate to="/" />
	}

	const handleLogout = async (event) => {
		event.preventDefault();

		try {
			await logout()
			.then(() => {
				setUser({})
    			setToken(null);
			});
		} catch (error) {
			console.error(error);
		}
  	};

	return (
		<button onClick={handleLogout} type="submit" className="button">
			Выйти
		</button>
	);
}