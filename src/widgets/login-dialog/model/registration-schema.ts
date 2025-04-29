import { z } from 'zod';

export const registrationData = z
    .object({
        email: z.string().email({ message: 'Неверный формат электронной почты!' }),
        name: z.string().min(2, { message: 'Имя должно содержать хотя бы 2 символа' }),
        password: z.string().min(6, { message: 'Пароль должен содержать хотя бы 6 символов!' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    });
