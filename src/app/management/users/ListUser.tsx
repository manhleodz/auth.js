"use client"
import default_avatar from '@/assets/user.png';
import EditUserModal from './EditUserModal';
import Image from 'next/image'
import React, { useState } from 'react'

interface USER {
    id: string,
    name: string | null,
    email: string,
    image: string | null,
    createdAt: Date
}

export default function ListUser({ mainUser, listUser }: { mainUser: any, listUser: any }) {

    const [modal, setModal] = useState<string | null>(null);
    if (ListUser.length === 0) return null;
    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Join
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUser.length > 0 && listUser.map((u: USER) => (
                            <tr key={u.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {u.name}
                                </th>
                                <td className="px-6 py-4">
                                    {u.email}
                                </td>
                                <td className="px-6 py-4">
                                    <Image width={40} height={40} src={u.image || default_avatar} className=" rounded-full" alt={`avatar-${u.id}`} />
                                </td>
                                <td className="px-6 py-4">
                                    {u.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setModal(u.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && <EditUserModal mainUser={mainUser} userId={modal} setModal={setModal} />}
        </>
    )
}
