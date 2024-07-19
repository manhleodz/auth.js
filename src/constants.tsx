import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        roles: ["user", "admin", "root"],
        title: 'Home',
        path: '/',
        icon: <Icon icon="lucide:home" width="24" height="24" />,
    },
    {
        roles: ["admin", "root"],
        title: 'Management',
        path: '/management',
        icon: <Icon icon="lucide:user" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { roles: ["admin", "root"], title: 'User', path: '/management/users' },
            { roles: ["root"], title: 'Admin', path: '/management/admins' },
            { roles: ["admin", "root"], title: 'Post', path: '/management/posts' },
        ],
    },
    // {
    //     roles: ["admin", "root"],
    //     title: 'History',
    //     path: '/history',
    //     icon: <Icon icon="lucide:history" width="24" height="24" />,
    // },
];