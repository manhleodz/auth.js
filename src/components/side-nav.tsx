'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDENAV_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import logo_aimesoft from '@/assets/aimesoft.png';
import { useSession } from 'next-auth/react';

const SideNav = () => {
    const session = useSession();
    const user = session.data?.user;

    if (!user?.role) return null;
    return (
        <>
            <div className="w-80 max-lg:w-0"></div>

            <div className="w-80 fixed top-0 left-0 z-50 bg-white h-full min-h-screen max-lg:hidden">
                <div className="flex flex-col space-y-6 w-full h-full border-r border-zinc-200">
                    <Link
                        href="/"
                        className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-zinc-200  w-full"
                    >
                        <Image src={logo_aimesoft} width={150} height={50} alt='logo' />
                    </Link>

                    {(user && user.role) && (
                        <div className="flex flex-col space-y-2  md:px-6 ">
                            {SIDENAV_ITEMS.map((item: any, idx: number) => {
                                if (item.roles.includes(user.role)) return (<MenuItem key={idx} item={item} role={user.role} />);
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SideNav;

const MenuItem = ({ item, role }: { item: SideNavItem, role: string }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <>
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${pathname.includes(item.path) ? 'bg-zinc-100' : ''
                            }`}
                    >
                        <div className="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className="font-semibold text-xl  flex">{item.title}</span>
                        </div>

                        <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                            <Icon icon="lucide:chevron-down" width="24" height="24" />
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                if (subItem.roles.includes(role))
                                    return (
                                        <Link
                                            key={idx}
                                            href={subItem.path}
                                            className={`${subItem.path === pathname ? 'font-bold' : ''
                                                }`}
                                        >
                                            <span>{subItem.title}</span>
                                        </Link>
                                    );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${item.path === pathname ? 'bg-zinc-100' : ''
                        }`}
                >
                    {item.icon}
                    <span className="font-semibold text-xl flex">{item.title}</span>
                </Link>
            )}
        </>
    );
};