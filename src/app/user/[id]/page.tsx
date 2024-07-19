import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import default_avatar from '@/assets/user.png';
import MakePost from "@/components/form/MakePost";
import Post from "@/components/ui/post";
import { auth } from "@/auth";
import { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, role: true, image: true, createdAt: true },
  });
});

const getPosts = cache(async (userId: string) => {
  return prisma.post.findMany({
    where: { userId: userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
})

export async function generateStaticParams() {
  const allUsers = await prisma.user.findMany();

  return allUsers.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params: { id } }: PageProps) {
  const user = await getUser(id);

  return {
    title: user?.name || `User ${id}`,
  };
}

export default async function Page({ params: { id } }: PageProps) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const session = await auth();
  const user = await getUser(id);
  const posts = await getPosts(id);

  if (!user) notFound();

  return (
    <div className=" flex-grow mx-3 my-10 flex flex-col items-center gap-3">
      <Image
        src={user.image || default_avatar}
        width={100}
        alt="User profile picture"
        height={100}
        className="rounded-full"
      />
      <h1 className="text-center text-xl font-bold">
        {user?.name || `User ${id}`}
      </h1>
      <p className="text-muted-foreground">
        User since {new Date(user.createdAt).toLocaleDateString()}
      </p>

      <div>
        <p className="text-center text-4xl font-bold">Posts</p>
        {(user && user.id === session?.user?.id) && <MakePost userId={user.id} />}
        <div className=" space-y-3">
          {posts.map((post) => (
            <Post key={post.id} post={post} user={session?.user?.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
