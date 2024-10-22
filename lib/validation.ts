import { z } from 'zod';

// const UserFormValidation = z.object({
//     username: z.string()
//         .min(2, {message: "Username must be at least 2 characters.",}),
// })

export const UserFormValidation = z.object({
    name: z.string()
        .min(2, "Username must be at least 2 characters.")
        .max(50, 'Username must at most be 50 characters'),
    email: z.string().email("Invalid email address"),
    // phone: z.string().refine(phone => /^\+?[1-9]\d{1,14}$/.test(phone))
    phone: z.string().refine(phone => /^\+\d{10,15}$/.test(phone), "Invalid phone number")
})
