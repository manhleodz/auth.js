import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import VerifiedPosts from "./VerifiedPosts";
import NotVerifiedPosts from "./NotVerifiedPosts";

export const metadata: Metadata = {
    title: "Admin",
};

interface POST {
    id: string,
    title: string,
    content: string,
    image: string,
    userId: string,
    verify: boolean,
    createdAt: Date,
    updatedAt: Date,
    user: {
        id: string,
        image: string,
        name: string
    }
}

export default async function Page() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    if (user?.role !== "admin" && user?.role !== "root") {
        return (
            <main className="mx-auto my-10">
                <p className="text-center">You are not authorized to view this page</p>
            </main>
        );
    }

    const verifiedPosts = await prisma.post.findMany({
        where: { verify: true },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    const notVerifiedPosts = await prisma.post.findMany({
        where: { verify: false },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return (
        <main className="flex-grow p-10 space-y-5">
            <NotVerifiedPosts notVerifiedPosts={notVerifiedPosts} user={user} />
            <VerifiedPosts verifiedPosts={verifiedPosts} user={user} />
        </main>
    );
}
