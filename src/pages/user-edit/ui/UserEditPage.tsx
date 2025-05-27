import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../../../shared/assets/BackIcon';
import { useState, useEffect } from 'react';
import { useStateContext } from '../../../app/providers/ContextProvider';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';
import './user-edit.scss';
import { updateUser } from '../../../shared/api/endpoints/users';

const range = (start: number, end: number, step = 1): number[] =>
    Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);

export const UserEditPage = () => {
    const navigate = useNavigate();
    const { user } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const sexOptions = [
        { value: 'M', label: 'Мужской' },
        { value: 'F', label: 'Женский' },
    ];
    const years = range(1950, getYear(new Date()) + 1, 1);
    const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    useEffect(() => {
        if (user.birthday) {
            const date = new Date(user.birthday);
            setStartDate(date);
        }
    }, [user.birthday]);

    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
        if (date) {
            setFormData((prev) => ({
                ...prev,
                birthday: date.toISOString().split('T')[0],
            }));
        }
    };

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
                image: user.image || null,
                sex: user.sex || '',
                birthday: user.birthday || '',
            });

            if (user.birthday) {
                setStartDate(new Date(user.birthday));
            }
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) return;

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
    console.log(user);
    return (
        <div>
            {isLoading && <div className="loading">Загрузка...</div>}
            {!isLoading && (
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="back-button" onClick={() => navigate(-1)}>
                        <BackIcon className="back-icon" />
                    </div>
                    <h1 className="title">Отредактируйте информацию о себе</h1>
                    <div className="form-item user-form-item">
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="name">Введите имя</label>
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
                        </div>
                        <div className="user-form-block-item">
                            <label htmlFor="birthday" className="text">
                                Введите дату рождения:{' '}
                            </label>
                            <DatePicker
                                id="birthday"
                                selected={startDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="custom-datepicker"
                                maxDate={new Date()}
                                renderCustomHeader={({
                                    date,
                                    changeYear,
                                    changeMonth,
                                    decreaseMonth,
                                    increaseMonth,
                                    prevMonthButtonDisabled,
                                    nextMonthButtonDisabled,
                                }) => (
                                    <div
                                        style={{
                                            margin: 10,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: 8,
                                            alignItems: 'center',
                                            backgroundColor: '#f0f0f0',
                                        }}>
                                        <button
                                            onClick={decreaseMonth}
                                            disabled={prevMonthButtonDisabled}>
                                            {'<'}
                                        </button>
                                        <select
                                            value={getYear(date)}
                                            onChange={({ target: { value } }) =>
                                                changeYear(+value)
                                            }>
                                            {years.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={months[getMonth(date)]}
                                            onChange={({ target: { value } }) =>
                                                changeMonth(months.indexOf(value))
                                            }>
                                            {months.map((month) => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={increaseMonth}
                                            disabled={nextMonthButtonDisabled}>
                                            {'>'}
                                        </button>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="user-form-item user-form-block">
                        <label htmlFor="image" className="text">
                            Загрузите изображение:
                        </label>
                        <input type="file" id="image" name="image" onChange={handleChange} />
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
