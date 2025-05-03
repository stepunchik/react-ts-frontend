import { useState } from 'react';
import { useStateContext } from '/src/app/providers/ContextProvider';
import { loginSchema } from '../model/loginSchema'
import { login } from '/src/shared/api/endpoints/login';

interface LoginFormProps {
	onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
	const { setUser, setToken } = useStateContext();

	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	function validateForm(data) {
		try {
            loginSchema.parse(data);
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

	const handleSubmit = async (event) => {
		event.preventDefault();
		validateForm(formData);

		try {
			const { data } = await login(formData)
			setUser(data.user)
			setToken(data.token);
			
			onClose();
		} catch (error) {
			console.error(error);
		}
  	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<div className='form-item'>
				<input id="email" name="email" value={formData.email} onChange={handleChange} required />
				<label htmlFor="email">Введите email</label>
				{errors.email && <p className="error">{errors.email}</p>}
			</div>

			<div className='form-item'>
				<input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
				<label htmlFor="password">Введите пароль</label>
				{errors.password && <p className="error">{errors.password}</p>}
			</div>

			<div className='form-item'>
				<button type="submit" className="button">
					Войти
				</button>
			</div>
		</form>
	);
}