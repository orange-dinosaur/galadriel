'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: string | LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={
                            pathname === item.url ||
                            pathname.startsWith(`${item.url}/`)
                        }>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <a href={item.url}>
                                    {/* TODO: Make icon visible */}
                                    {/* <item.icon /> */}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                            {item.items?.length ? (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                            <ChevronRight />
                                            <span className="sr-only">
                                                Toggle
                                            </span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={`${
                                                            pathname ===
                                                                subItem.url ||
                                                            pathname.startsWith(
                                                                `${subItem.url}`
                                                            )
                                                                ? 'bg-secondary'
                                                                : ''
                                                        }`}>
                                                        <a
                                                            href={`${subItem.url}`}>
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            ) : null}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
