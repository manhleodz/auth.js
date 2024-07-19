import prisma from "@/lib/prisma";
import MakePost from "@/components/form/MakePost";
import Post from "@/components/ui/post";
import { auth } from "@/auth";
import { cache } from "react";

const getPosts = cache(async () => {
  return await prisma.post.findMany({
    where: { verify: true },
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
  });
})

export default async function Home() {
  const posts = await getPosts();
  const session = await auth();
  const user = session?.user;
  
  return (
    <main className="flex-grow flex flex-col items-center gap-6 px-3 py-10">
      <p className="text-center text-4xl font-bold">Posts</p>
      {(user && user.id) && <MakePost userId={user.id} />}
      <div className=" space-y-3">
        {posts.map((post) => (
          <Post key={post.id} post={post} user={user} />
        ))}
      </div>
    </main>
  );
}
