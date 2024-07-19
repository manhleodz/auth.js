import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { cache } from "react";
import ListUser from "./ListUser";

export const metadata: Metadata = {
    title: "Admin",
};

const getListUser = cache(async () => {
    return await prisma.user.findMany({
        where: { role: "user" },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
})

export default async function Page() {

    const session = await auth();
    const user = session?.user;

    if (!user) {
        return redirect("/api/auth/signin?callbackUrl=/admin");
    }

    if (user.role !== "admin" && user.role !== "root") {
        return (
            <main className="mx-auto my-10">
                <p className="text-center">You are not authorized to view this page</p>
            </main>
        );
    }

    const listUser = await getListUser();

    if (!listUser) return null;
    return (
        <main className="flex-grow p-10">
            <ListUser mainUser={user} listUser={listUser} />
        </main>
    );
}
