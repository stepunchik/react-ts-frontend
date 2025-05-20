import { useState } from 'react';
import { loginSchema } from '../model/loginSchema';
import { useStateContext } from '../../../../app/providers/ContextProvider';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { login } from '../../../../shared/api/endpoints/login';

interface LoginFormProps {
    onClose: () => void;
}

type FormErrors = Record<string, string>;

export const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
    const { setUser, setToken } = useStateContext();

    const [errors, setErrors] = useState<FormErrors>({});
    const [loginError, setLoginError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    function validateForm(data: any): boolean {
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
                return false;
            }
        }
        return true;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm(formData)) {
            return;
        }

        try {
            const response = await login(formData);
            const data = response.data;

            setUser(data.user);
            setToken(data.token);

            onClose();
        } catch (error) {
            console.error(error);

            const err = error as AxiosError<{ message: string }>;
            if (err.response?.data?.message) {
                setLoginError(err.response.data.message);
            }
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
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Введите пароль</label>
                {errors.password && <p className="error">{errors.password}</p>}
                {loginError && <p className="error">{loginError}</p>}
            </div>

            <div className="form-item">
                <button type="submit" className="button">
                    Войти
                </button>
            </div>
        </form>
    );
};
