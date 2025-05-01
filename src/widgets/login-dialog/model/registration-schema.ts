// validationSchemas.ts
import { z } from "zod";

const email = z.string().email("Введите корректный email");
const password = z.string().min(6, "Пароль должен быть не менее 6 символов");

export const loginSchema = z.object({
    email,
    password,
});

export const signupSchema = z.object({
    name: z.string().min(2, "Имя обязательно"),
    email,
    password,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
});