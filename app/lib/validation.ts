import { z } from "zod"

export const authSchema = z.object({
  username: z.string()
    .min(1, "Username cannot be empty")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .refine(val => !val.includes('@'), "Username cannot be in email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
})

export type AuthSchema = z.infer<typeof authSchema>