import React, { useEffect, useState } from 'react';
import { useStateContext } from '@app/providers/ContextProvider';
import { getYear, getMonth } from 'date-fns';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './custom-date-picker.scss';

const range = (start: number, end: number, step = 1): number[] =>
    Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);

interface CustomDatePickerProps {
    setFormData: (prev: any) => any;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ setFormData }) => {
    const { user } = useStateContext();
    const [startDate, setStartDate] = useState<Date | null>(new Date());
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
            setFormData((prev: any) => ({
                ...prev,
                birthday: date.toISOString().split('T')[0],
            }));
        }
    };

    return (
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
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            {'<'}
                        </button>
                        <select
                            value={getYear(date)}
                            onChange={({ target: { value } }) => changeYear(+value)}>
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
                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            {'>'}
                        </button>
                    </div>
                )}
            />
        </div>
    );
};
