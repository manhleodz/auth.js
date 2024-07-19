"use client"
import React, { useState } from 'react'
import EditPostModal from './EditPostModal';

export default function NotVerifiedPosts({ notVerifiedPosts, user }: { notVerifiedPosts: any, user: any }) {
    const [modal, setModal] = useState(null);

    return (
        <>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <h1 className=" text-xl font-bold">Bài viết chưa xác thực</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                content
                            </th>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Created at
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {notVerifiedPosts.length > 0 && notVerifiedPosts.map((p: any) => (
                            <tr key={p.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {p.title}
                                </th>
                                <td className="px-6 py-4">
                                    {p.content}
                                </td>
                                <td className="px-6 py-4">
                                    {p.user.name}
                                </td>
                                <td className="px-6 py-4">
                                    {p.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setModal(p)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {modal && <EditPostModal post={modal} user={user} setModal={setModal} />}
            </div>
        </>
    )
}
