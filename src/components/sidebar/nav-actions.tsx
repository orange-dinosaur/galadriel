import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SquarePenIcon } from 'lucide-react';

export function NavActions() {
    return (
        <SidebarGroup className="pt-8">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        tooltip="Create new project"
                        className="cursor-pointer"
                        onClick={() => console.log('NEW PROJECT')}>
                        <span>
                            <SquarePenIcon />
                            <span>Create new project</span>
                        </span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
