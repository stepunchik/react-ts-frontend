// validationSchemas.ts
import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Имя обязательно"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
});