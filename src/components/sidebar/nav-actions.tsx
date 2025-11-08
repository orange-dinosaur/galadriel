import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ProjectAction } from '@/components/projects/project-action';
import { SquarePenIcon } from 'lucide-react';

export function NavActions() {
    return (
        <SidebarGroup className="pt-8">
            <SidebarMenu>
                <ProjectAction action="create">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Create new project"
                            className="cursor-pointer">
                            <span>
                                <SquarePenIcon className="max-w-3.5 max-h-3.5" />
                                <span className="text-sm">
                                    Create new project
                                </span>
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </ProjectAction>
            </SidebarMenu>
        </SidebarGroup>
    );
}
