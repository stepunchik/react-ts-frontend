import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Введите корректный email"),
    password: z.string()
});