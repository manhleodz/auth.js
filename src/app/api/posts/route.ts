import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from '@/lib/apiMiddelware';

export async function POST(req: NextRequest, res: NextResponse) {
    await authMiddleware(req, res, async () => {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = (body.file as Blob) || null;
        const title = (body.title as string) || null;
        const content = (body.content as string) || null;
        const userId = (body.userId as string);

        if (!userId) return NextResponse.json({ message: "UnAuthorized" }, { status: 401 })
        const downloadURL = await upload(file);

        await prisma.post.create({
            data: {
                title: title,
                content: content,
                image: downloadURL,
                userId: userId,
                verify: false
            }
        })
        return res.json({ message: "Wait for admin" }, { status: 200 });
    })
}

async function upload(pdfBuffer: any) {
    // firebase
    const storageRef = ref(storage, `posts/home_${Date.now()}.jpg`);
    const snapshot = await uploadBytesResumable(storageRef, pdfBuffer);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}