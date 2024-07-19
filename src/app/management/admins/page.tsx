import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import default_avatar from '@/assets/user.png';
import ListAdmin from "./ListAdmin";

interface USER {
  id: string,
  name: string | null,
  email: string,
  image: string | null,
  createdAt: Date
}

export const metadata: Metadata = {
  title: "Admin",
};

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/management/admins");
  }

  if (user.role !== "root") {
    return (
      <main className="mx-auto my-10">
        <p className="text-center">You are not authorized to view this page</p>
      </main>
    );
  }

  const list = await prisma.user.findMany({
    where: { role: "admin" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true
    }
  })

  return (
    <main className="flex-grow p-10">
      <ListAdmin listAdmin={list} />
    </main>
  );
}
