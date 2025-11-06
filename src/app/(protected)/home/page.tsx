import { user } from '@/auth/user';
import axiosInstance from '@/lib/axiosInstance';
import { AppSidebarData, DbDocumentRow, UserData } from '@/lib/custom-types';

export default async function Home() {
    const u = await user.getUser();

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/users/${u.$id}`,
        'get'
    );

    let resData: UserData;
    let data: AppSidebarData;

    if (response.data?.status) {
        /* TODO: check better the response */
        resData = new UserData();
        data = new AppSidebarData();
    } else {
        resData = UserData.fromObject(response.data.userData);
        data = AppSidebarData.fromUserData(resData);
    }

    const randomQuote = await axiosInstance(
        process.env.NEXT_PUBLIC_RANDOM_BOOK_QUOTE_ENDPOINT ?? '',
        'get'
    );
    const quote =
        randomQuote.data.quote ??
        'Non lo spegni, il mare, quando brucia nella notte';
    const title = randomQuote.data.book ?? 'Oceano Mare';
    const author = randomQuote.data.author ?? 'Alessandro Baricco';

    return (
        <>
            {data.navMain.length === 0 && (
                <div className="w-full h-full flex justify-center items-center">
                    <div className="flex flex-col justify-center w-4/6 text-muted-foreground">
                        <blockquote className="border-l-4 border-muted-foreground pl-6 italic mb-8 text-5xl">
                            {quote}
                        </blockquote>
                        <p className="text-right text-xl italic">{title}</p>
                        <p className="text-right text-xl italic">({author})</p>
                    </div>
                </div>
            )}
            {data.navMain.length !== 0 && (
                <div>
                    <div>PROJECTS</div>
                    <br />
                    <div>
                        {data.navMain.map((project: any) => (
                            <a href={project.url} key={project.$id}>
                                <div key={project.$id}>{project.title}</div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
