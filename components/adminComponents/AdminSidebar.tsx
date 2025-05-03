"use client";

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
import { usePathname } from "next/navigation";

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
                    isActive: true,
                },
                {
                    title: 'Students',
                    url: '/admin/students',
                },
                {
                    title: 'Courses',
                    url: '/admin/courses',
                },
                {
                    title: 'Enrollment',
                    url: '/admin/enrollment',
                },
                {
                    title: 'Admin List',
                    url: '/admin/adminUsers',
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
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.url}
                                        >
                                            <a href={item.url}>{item.title}</a>
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
