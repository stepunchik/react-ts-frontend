import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStateContext } from '@app/providers/ContextProvider';

import { updateUser } from '@shared/api/endpoints/users';
import { CustomDatePicker } from './CustomDatePicker';
import { userEditSchema } from '../model/userEditSchema';
import { ZodError } from 'zod';

import './user-edit-form.scss';
import { BeatLoader } from 'react-spinners';

type FormErrors = Record<string, string>;

export const UserEditForm = () => {
    const navigate = useNavigate();
    const { user } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});

    const sexOptions = [
        { value: 'M', label: 'Мужской' },
        { value: 'F', label: 'Женский' },
    ];

    const [formData, setFormData] = useState<{
        name: string;
        image?: File | null;
        sex: string;
        birthday: string;
    }>({
        name: '',
        image: null,
        sex: '',
        birthday: '',
    });

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            setFormData({
                name: user.name || '',
                image: null,
                sex: user.sex || '',
                birthday: user.birthday || '',
            });

            setIsLoading(false);
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files, value, type } = event.target;

        if (type === 'file' && files && files[0]) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function validateForm(data: any): boolean {
        try {
            userEditSchema.parse(data);
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

        if (!user) return;

        if (!validateForm(formData)) {
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('sex', formData.sex);
        data.append('birthday', formData.birthday);
        if (formData.image) data.append('image', formData.image);

        await updateUser(user.id, data)
            .then(() => {
                navigate(`/users/${user.id}`);
            })
            .catch((err) => {
                console.error('Ошибка загрузки пользователя:', err);
            });
    };

    return (
        <div>
            {isLoading && (
                <div className="loading">
                    <BeatLoader />
                </div>
            )}
            {!isLoading && (
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="form-item user-form-item">
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="name">Введите имя</label>
                        {errors.name && <p className="error">{errors.name}</p>}
                    </div>
                    <div className="user-form-block">
                        <div className="user-form-block-item">
                            <label htmlFor="sex" className="text">
                                Выберите пол:{' '}
                            </label>
                            <select
                                id="sex"
                                name="sex"
                                value={formData.sex}
                                onChange={handleSelectChange}
                                required>
                                <option value="" className="option">
                                    Выберите пол
                                </option>
                                {sexOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        className="option">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.sex && <p className="error">{errors.sex}</p>}
                        </div>
                        <CustomDatePicker setFormData={setFormData} />
                        {errors.birthday && <p className="error">{errors.birthday}</p>}
                    </div>
                    <div className="user-form-item">
                        <div className="image-form-item">
                            <label htmlFor="image" className="text">
                                Загрузите изображение:
                            </label>
                            <div className="image-upload">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleChange}
                                />
                                {errors.image && <p className="error">{errors.image}</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text">Старое изображение:</div>
                        <img src={user.image} alt={user.name} className="user-edit-image" />
                    </div>
                    <div className="button-block">
                        <button type="submit" className="button form-button">
                            Сохранить
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
