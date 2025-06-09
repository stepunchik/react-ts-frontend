import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const publicationEditSchema = z.object({
    title: z.string().min(3, 'Заголовок должен содержать хотя бы 3 символа.').optional(),
    text: z.string().min(20, 'Текст должен содержать хотя бы 20 символов').optional(),
    image: z
        .any()
        .optional()
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
            'Поддерживаемые форматы изображений: jpeg, jpg, png'
        ),
});
