import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerStep1Schema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["tourist", "companion"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerStep2Schema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().optional(),
  /** Raw string from <input type="number"> — parsed to number in the action */
  hourly_rate: z.string().optional(),
  languages: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
});

export const companionProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  /** Raw string from <input type="number"> — parsed to number in the action */
  hourly_rate: z.string().optional(),
  languages: z.array(z.string()).min(1, "Add at least one language"),
  activities: z.array(z.string()).min(1, "Add at least one activity"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterStep1Input = z.infer<typeof registerStep1Schema>;
export type RegisterStep2Input = z.infer<typeof registerStep2Schema>;
export type CompanionProfileInput = z.infer<typeof companionProfileSchema>;
