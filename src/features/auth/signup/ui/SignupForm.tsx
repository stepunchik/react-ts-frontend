import { useState } from 'react';
import { signupSchema } from '../model/signupSchema';
import { useStateContext } from '../../../../app/providers/ContextProvider';
import { ZodError } from 'zod';
import { signup } from '../../../../shared/api/endpoints/signup';
import { login } from '../../../../shared/api';

interface SignupFormProps {
    onClose: () => void;
}

type FormErrors = Record<string, string>;

export const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
    const { setUser, setToken } = useStateContext();

    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (event: { target: { name: any; value: any } }) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    function validateForm(data: any) {
        try {
            signupSchema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: FormErrors = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                return false;
            }
        }
    }

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (!validateForm(formData)) {
            return;
        }

        try {
            await signup(formData);

            const response = await login({
                email: formData.email,
                password: formData.password,
            });
            const data = response.data;

            setUser(data.user);
            setToken(data.token);

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <div className="form-item">
                <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="email">Введите email</label>
                {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-item">
                <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="name">Введите имя</label>
                {errors.email && <p className="error">{errors.name}</p>}
            </div>

            <div className="form-item">
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Введите пароль</label>
                {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="form-item">
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="confirmPassword">Подтвердите пароль</label>
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>

            <div className="form-item">
                <button type="submit" className="button">
                    Зарегистрироваться
                </button>
            </div>
        </form>
    );
};
