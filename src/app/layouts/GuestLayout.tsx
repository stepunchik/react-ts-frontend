import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from '../../widgets/sidebar';
import { Header } from '../../widgets/header';
import { useStateContext } from "../providers/ContextProvider";

import './layout.scss'

export const GuestLayout = () => {
	const { user, token } = useStateContext();

	if (token) {
		return <Navigate to="/" />;
	}

	return (
		<div>
            <Header isGuestLayout={true}/>
            <Sidebar isGuestLayout={true}/>
            <main>
                <Outlet />
            </main>
        </div>
	);
}