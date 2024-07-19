import { ROLE } from "@prisma/client";
import { z } from "zod";

export enum Role {
    ADMIN = "admin",
    USER = "user",
    ROOT = "root"
}

export const updateProfileSchema = z.object({
    id: z.string().min(1, 'UserID is required'),
    name: z.string().trim().min(1, "Cannot be empty"),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    role: z.enum([ROLE.admin, ROLE.user, ROLE.root]),
});

export const updateUserSchema = z.object({
    name: z.string().trim().min(1, "Cannot be empty"),
});

export const updatePostSchema = z.object({
    id: z.string().min(1, 'PostID is required'),
    title: z.string().trim().nullable(),
    content: z.string().trim().nullable(),
    image: z.string().trim().nullable(),
    userId: z.string().min(1, 'UserID is required'),
    verify: z.boolean()
});


export const FormLoginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must have than 8 characters'),
});

export type UpdatePostValues = z.infer<typeof updatePostSchema>;

export type UpdateUserValues = z.infer<typeof updateUserSchema>;

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
