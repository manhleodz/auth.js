"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validate";
import { revalidatePath } from "next/cache";

export async function updateProfile(values: UpdateProfileValues) {
  const session = await auth();
  const user = session?.user;
  const userId = session?.user?.id;

  if (!userId) {
    throw Error("Unauthorized");
  }
  console.log(user);
  
  if (user?.role !== "root") {
    throw Error("Unauthorized")
  };

  const { id, name, email, role } = updateProfileSchema.parse(values);

  const currentUser = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!currentUser) {
    throw Error("User not found");
  }

  if (currentUser?.email === email) {
    await prisma.user.update({
      where: { id: id },
      data: { name, role },
    });
  } else {
    await prisma.user.update({
      where: { id: id },
      data: { name, email, role },
    });
  }

  revalidatePath("/");
}
