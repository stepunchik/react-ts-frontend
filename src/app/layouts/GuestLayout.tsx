import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';
import { Outlet } from 'react-router-dom';

import './layout.scss';

export const GuestLayout = () => {
	return (
		<div>
			<Header isAuthenticated={false}/>
			<Sidebar isAuthenticated={false}/>
			<main className="main">
				<Outlet />
			</main>
		</div>
	);
};
