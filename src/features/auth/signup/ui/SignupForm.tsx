import { useState } from 'react';
import { useStateContext } from '/src/app/providers/ContextProvider';
import { signupSchema } from '../model/signupSchema'
import { login } from '/src/shared/api/endpoints/login';
import { signup } from '/src/shared/api/endpoints/signup';

interface SignupFormProps {
	onClose: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
	const { setUser, setToken } = useStateContext();

	const [errors, setErrors] = useState({});
	
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
            signupSchema.parse(data);
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
			await signup(formData);

			const { data } = await login({
				email: formData.email,
				password: formData.password
			})
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
				<input id="name" name="name" value={formData.name} onChange={handleChange} required />
				<label htmlFor="name">Введите имя</label>
				{errors.email && <p className="error">{errors.name}</p>}
			</div>

			<div className='form-item'>
				<input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
				<label htmlFor="password">Введите пароль</label>
				{errors.password && <p className="error">{errors.password}</p>}
			</div>

			<div className='form-item'>
				<input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
				<label htmlFor="confirmPassword">Подтвердите пароль</label>
				{errors.confirmPassword && (
					<p className="error">{errors.confirmPassword}</p>
				)}
			</div>

			<div className='form-item'>
				<button type="submit" className="button">
					Зарегистрироваться
				</button>
			</div>
		</form>
	);
}