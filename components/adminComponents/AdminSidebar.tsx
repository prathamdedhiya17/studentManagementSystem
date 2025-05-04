'use client';

import * as React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
    GraduationCap,
    LaptopMinimalCheck,
    LayoutDashboard,
    LibraryBig,
    UserCog,
} from 'lucide-react';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Admin Dashboard',
            url: '/admin',
            items: [
                {
                    title: 'Dashboard',
                    url: '/admin',
                    icon: <LayoutDashboard />,
                },
                {
                    title: 'Students',
                    url: '/admin/students',
                    icon: <GraduationCap />,
                },
                {
                    title: 'Courses',
                    url: '/admin/courses',
                    icon: <LibraryBig />,
                },
                {
                    title: 'Enrollment',
                    url: '/admin/enrollment',
                    icon: <LaptopMinimalCheck />,
                },
                {
                    title: 'Admin List',
                    url: '/admin/adminUsers',
                    icon: <UserCog />,
                },
            ],
        },
    ],
};

export function AdminSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    console.log(pathname);
    return (
        <Sidebar {...props}>
            <SidebarHeader></SidebarHeader>
            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel className='text-primary text-base opacity-100'>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.url}
                                        >
                                            <a href={item.url} className='my-1'>
                                                <span className={`w-5 h-5 ${pathname === item.url && 'text-primary'}`}>
                                                    {item.icon}
                                                </span>
                                                <span className='ml-2'>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
