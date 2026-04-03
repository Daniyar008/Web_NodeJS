import { z } from "zod";

export const registerSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password too long"),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    roleName: z.enum(["INSTITUTION_ADMIN", "TEACHER", "STUDENT", "PARENT"]),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
    email: z.email(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password too long"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshDto = z.infer<typeof refreshSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
