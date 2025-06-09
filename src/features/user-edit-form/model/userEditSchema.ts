import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const userEditSchema = z
    .object({
        name: z.string().min(2, 'Имя должно содержать хотя бы 2 символа.').optional(),
        sex: z.string().optional(),
        birthday: z.string().optional(),
        image: z
            .any()
            .optional()
            .refine(
                (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
                'Поддерживаемые форматы изображений: jpeg, jpg, png'
            ),
    })
    .refine((data) => data.sex === 'M' || data.sex === 'F', {
        message: 'Необходимо указать пол.',
        path: ['sex'],
    });
