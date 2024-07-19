import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import Link from 'next/link'
import user_avatar from '@/assets/user.png';
import { memo } from 'react';
import LikeButton from './LikeButton';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface PostProps {
    post: any,
    user: any
}

const Post = ({ post, user }: PostProps) => {

    return (
        <div key={post.id} className=" w-[500px] bg-white rounded-xl border-none shadow-xl">
            <div className=" flex items-center justify-between p-2">
                <div className=" flex items-center space-x-2">
                    <Image
                        alt={`avatar-${post.id}`} width={50} height={50} src={post.user.image || user_avatar}
                        className=" rounded-full object-contain"
                    />
                    <Link href={`/user/${post.user.id}`} className=" text-lg font-[500] hover:underline hover:underline-offset-4 hover:text-blue-700">{post.user.name}</Link>
                </div>
                {(user && (user.id === post.user.id)) && (
                    <button className=" p-2 rounded-lg bg-red-600">
                        <Icon icon="lucide:trash" width="18" height="18" color="white" />
                    </button>
                )}
            </div>
            <h1 className='px-2'>{post.title}</h1>
            <h1 className='px-2'>{post.content}</h1>
            <Image
                src={post.image || "https://loremflickr.com/640/480"}
                width={500}
                height={400}
                alt='anh'
                className=''
            />
            <div className=' w-full h-[50px] p-2 flex items-center justify-between'>
                {user && <LikeButton />}
            </div>
        </div>
    )
}

export default memo(Post);
