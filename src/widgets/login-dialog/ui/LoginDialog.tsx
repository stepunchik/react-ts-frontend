import React, { useState } from 'react';
import { loginSchema, signupSchema } from '../model/registration-schema';
import { ZodError } from 'zod';
import { login } from '/src/shared/api/endpoints/login';
import { signup } from '/src/shared/api/endpoints/signup';

import './login-dialog.scss';

export const LoginDialog = () => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [errors, setErrors] = useState({});

	const validationSchema = isSignUp ? signupSchema : loginSchema;

	const [formData, setFormData] = useState({
		email: '',
		name: '',
		password: '',
		confirmPassword: ''
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	function validateForm(data) {
		try {
            validationSchema.parse(data);
            setErrors({});
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: FormErrors = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		validateForm(formData);

		if (isSignUp) {
			signup(formData);
		}
		else {
			login(formData);
		}
		
  	};

	const toggleForm = () => {
		setErrors({});
		setIsSignUp((prev) => !prev);
	};

	return (
		<div className="dialog">
			<div className="text-block">
				<h2 className="title">{isSignUp ? 'Регистрация' : 'Вход'}</h2>
				{!isSignUp && <p className="text">Войдите в свой аккаунт.</p>}
			</div>

			<form onSubmit={handleSubmit} className="form">
				<div className='form-item'>
					<input id="email" name="email" value={formData.email} onChange={handleChange} required />
					<label htmlFor="email">Введите email</label>
					{errors.email && <p className="error">{errors.email}</p>}
				</div>

				{isSignUp && (
					<div className='form-item'>
						<input id="name" name="name" value={formData.name} onChange={handleChange} required />
						<label htmlFor="name">Введите имя</label>
						{errors.email && <p className="error">{errors.name}</p>}
					</div>
				)}

				<div className='form-item'>
					<input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
					<label htmlFor="password">Введите пароль</label>
					{errors.password && <p className="error">{errors.password}</p>}
				</div>

				{isSignUp && (
					<div className='form-item'>
						<input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
						<label htmlFor="confirmPassword">Подтвердите пароль</label>
						{errors.confirmPassword && (
							<p className="error">{errors.confirmPassword}</p>
						)}
					</div>
				)}
				<div className='form-item'>

				<button type="submit" className="button">
					{isSignUp ? 'Зарегистрироваться' : 'Войти'}
				</button>
				</div>

				<div>
					{isSignUp ? (
						<p className="text">
							Уже есть аккаунт? <a onClick={toggleForm} className="link"> Войдите</a>.
						</p>
					) : (
						<p className="text">
							Еще нет аккаунта? <a onClick={toggleForm} className="link"> Зарегистрируйтесь</a>.
						</p>
					)}
				</div>
			</form>
		</div>
	);
};
