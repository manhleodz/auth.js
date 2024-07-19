import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) return NextResponse.json({ message: "Thieeu id" }, { status: 404 })

    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true
            }
        })
        if (!user) return NextResponse.json({ message: "User not found!!!" }, { status: 404 })
        return NextResponse.json(user, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return NextResponse.json(error);
    }
}
