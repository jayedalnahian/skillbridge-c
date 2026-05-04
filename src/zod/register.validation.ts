import { z } from "zod";

export const registerZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  image: z.instanceof(File).optional(),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;
