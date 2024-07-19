import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import * as z from 'zod';

enum ROLE {
    admin = 'admin',
    root = 'root',
    user = 'user'
}

const userSchema = z
    .object({
        email: z.string().email(),
        name: z.string(),
        confirmPassword: z.string(),
        password: z.string().min(1, "Password is required").min(8, "Password must have than 8 characters"),
        role: z.enum([ROLE.root, ROLE.admin, ROLE.user])
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirm"],
    });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, password, confirmPassword, role } = userSchema.parse(body);

        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email }
        });


        if (existingUserByEmail) return NextResponse.json(
            {
                error: "Email",
                message: "User with this email already exits"
            },
            { status: 409 }
        )

        const hashedPassword = await hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role || 'user',
                image: "https://cdn-icons-png.freepik.com/512/6596/6596121.png"
            }
        }).then(async (e) => {
            await prisma.account.create({
                data: {
                    userId: e.id,
                    type: "credentials",
                    provider: "credentials",
                    providerAccountId: e.id,
                    token_type: "bearer",
                    scope: role || 'user',
                }
            })
        })

        return NextResponse.json({
            message: "User created successfully"
        }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: "Opps!! Something went wrong",
            error: error
        }, { status: 400 })
    }
}