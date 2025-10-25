'use client';

import * as React from 'react';
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    Notebook,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { AppSidebarData } from '@/lib/custom-types';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    data: {
        user: {
            name: string;
            email: string;
            avatar: string;
        };
        navMain: {
            title: string;
            url: string;
            icon?: string;
            isActive: boolean;
            items?: {
                title: string;
                url: string;
            }[];
        }[];
    };
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
    /* TODO: Set the icon dynamically */

    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}>
            {/* <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/home">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Acme Inc
                                    </span>
                                    <span className="truncate text-xs">
                                        Enterprise
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader> */}
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
