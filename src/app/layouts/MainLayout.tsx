import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { GuestLayout } from './GuestLayout';
import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';
import { useStateContext } from '../providers/ContextProvider';
import { currentUser } from '/src/shared/api/endpoints/currentUser';

import './layout.scss';

export const MainLayout = () => {
	const { user, token, setUser, setToken } = useStateContext();
	console.log(token);
	// useEffect(() => {
	// 	currentUser()
	// 	.then(({data}) => {
	// 		setUser(data)
	// 	})
	// }, [])

	if (!token) {
		return <GuestLayout />
	}

	return (
		<div>
			<Header isAuthenticated={true}/>
			<Sidebar isAuthenticated={true}/>
			<main className="main">
				<Outlet />
			</main>
		</div>
	);
};
