import { user } from '@/auth/user';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getAllProjectsOfUser } from '@/db/projects';
import axiosInstance from '@/lib/axiosInstance';
import { Project, UserDataFull } from '@/lib/custom-types';

export const iframeHeight = '800px';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const u = await user.getUser();

    const response = await getAllProjectsOfUser(u.$id);

    let data: UserDataFull;
    if (response.status === 200 && response.data) {
        const projects: Project[] = response.data.map((project: any) => {
            return Project.fromObject(project);
        });

        data = UserDataFull.fromObject({
            user: {
                name: u.name,
                email: u.email,
                avatar: process.env.NEXT_PUBLIC_AVATAR_ENDPOINT + u.$id,
                $id: u.$id,
            },
            projects: projects,
        });
    } else {
        data = UserDataFull.fromObject({
            user: {
                name: u.name,
                email: u.email,
                avatar: process.env.NEXT_PUBLIC_AVATAR_ENDPOINT + u.$id,
                $id: u.$id,
            },
            projects: [],
        });
    }
    const dataObject = data.toObject();

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <AppSidebar data={dataObject} />
                    <SidebarInset>
                        <div className="flex flex-1 flex-col p-4 pt-0">
                            <div className="min-h-screen flex-1 md:min-h-min">
                                {children}
                            </div>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
