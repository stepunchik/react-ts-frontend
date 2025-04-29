import React, { useState } from 'react';
import { registrationData } from '../model/registration-schema';
import { ZodError } from 'zod';

import './login-dialog.scss';

type FormErrors = Record<string, string>;

export const LoginDialog = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            registrationData.parse(data);
            setErrors({});
            // TODO: отправить данные на сервер
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
                    <input id="email" name="email" required />
                    <label htmlFor="email">Введите email</label>
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                {isSignUp && (
                    <div className='form-item'>
                        <input id="name" name="text" required />
                        <label htmlFor="name">Введите имя</label>
                        {errors.email && <p className="error">{errors.name}</p>}
                    </div>
                )}

                <div className='form-item'>
                    <input id="password" name="password" type="password" required />
                    <label htmlFor="password">Введите пароль</label>
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                {isSignUp && (
                    <div className='form-item'>
                        <input id="confirmPassword" name="confirmPassword" type="password" required />
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

                <p>
                    {isSignUp ? (
                        <p className="text">
                            Уже есть аккаунт? <a onClick={toggleForm} className="link"> Войдите</a>.
                        </p>
                    ) : (
                        <p className="text">
                            Еще нет аккаунта? <a onClick={toggleForm} className="link"> Зарегистрируйтесь</a>.
                        </p>
                    )}
                </p>
            </form>
        </div>
    );
};
