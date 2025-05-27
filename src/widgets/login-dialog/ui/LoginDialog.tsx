import React, { useState } from 'react';
import { LoginForm, SignupForm } from '../../../features/auth';

import './login-dialog.scss';

interface LoginDialogProps {
	onClose: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ onClose }) => {
	const [isSignup, setIsSignup] = useState(false);

	const toggleForm = () => {
		setIsSignup((prev) => !prev);
	};

	return (
		<div className="dialog">
			<div className="text-block">
				<h2 className="title">{isSignup ? 'Создайте аккаунт' : 'Вход'}</h2>
				{!isSignup && <p className="text">Войдите в свой аккаунт.</p>}
			</div>

			{ isSignup ? <SignupForm onClose={onClose} /> : <LoginForm onClose={onClose} /> }

			<div>
				{ isSignup ? (
					<p className="text">
						Уже есть аккаунт? <a onClick={toggleForm} className="link"> Войдите</a>.
					</p>
				) : (
					<p className="text">
						Еще нет аккаунта? <a onClick={toggleForm} className="link"> Зарегистрируйтесь</a>.
					</p>
				)}
			</div>
		</div>
	);
};
