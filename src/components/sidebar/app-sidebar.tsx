'use client';

import * as React from 'react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { NavActions } from './nav-actions';
import { UserDataFull, UserDataFullObject } from '@/lib/custom-types';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    /* data: {
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
    }; */
    data: UserDataFullObject;
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
    /* TODO: Set the icon dynamically */

    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}>
            <SidebarContent>
                <NavActions />

                <NavMain data={data} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
