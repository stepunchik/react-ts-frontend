import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';
import { useStateContext } from '../providers/ContextProvider';
import { currentUser } from '/src/shared/api/endpoints/currentUser';

import './layout.scss';

export const MainLayout = () => {
	const { user, token, setUser, setToken } = useStateContext();

	if (!token) {
		return <Navigate to="/"/>
	}

	useEffect(() => {
		currentUser()
		.then(({data}) => {
			setUser(data)
		})
	}, [])

	return (
		<div>
			<Header isGuestLayout={false}/>
			<Sidebar isGuestLayout={false}/>
			<main>
				<Outlet />
			</main>
		</div>
	);
};
