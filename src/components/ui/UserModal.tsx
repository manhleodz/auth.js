import prisma from "@/lib/prisma";
import { cache } from "react";


const getUser = cache(async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    });
});

export default async function UserModal({ id }: { id: string }) {

    const user = await getUser(id);

    return (
        <>
            <h1>{user?.name}</h1>
        </>
    )
}
