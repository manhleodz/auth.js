"use server"

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UpdatePostValues, updatePostSchema } from "@/lib/validate";
import { revalidatePath } from "next/cache";

export async function updatePost(values: UpdatePostValues) {
    const session = await auth();
    const user_id = session?.user?.id;

    if (!user_id) {
        throw Error("Unauthorized");
    }

    const { id, title, content, image, userId, verify } = updatePostSchema.parse(values);

    await prisma.post.update({
        data: { title, content, image, userId, verify },
        where: { id: id }
    })

    revalidatePath("/");
}
