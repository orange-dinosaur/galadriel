import { user } from '@/auth/user';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import axiosInstance from '@/lib/axiosInstance';
import { AppSidebarData, DbDocumentRow, UserData } from '@/lib/custom-types';

export const iframeHeight = '800px';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const u = await user.getUser();

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/documents`,
        'get'
    );

    let data = AppSidebarData.empty();

    if (response.data.status && response.data.status !== 200) {
        data.user.name = u.name;
        data.user.email = u.email;
        data.user.avatar = process.env.NEXT_PUBLIC_AVATAR_ENDPOINT + u.name;
    } else {
        const resData: UserData = UserData.fromApiResponse(
            response.data.userData
        );

        resData.user.name = u.name;
        resData.user.email = u.email;
        resData.user.avatar = process.env.NEXT_PUBLIC_AVATAR_ENDPOINT + u.name;

        data = AppSidebarData.fromUserData(resData);
    }

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <AppSidebar data={data.toObject()} />
                    <SidebarInset>
                        <div className="flex flex-1 flex-col gap-4 p-4">
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
