import { user } from '@/auth/user';
import { getAllProjectsOfUser } from '@/db/projects';
import axiosInstance from '@/lib/axiosInstance';
import { Project, UserDataFull } from '@/lib/custom-types';

export default async function Home() {
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

    const projectList = data.projects.map((p) => p.project);

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
            {data.projects.length === 0 && (
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
            {data.projects.length !== 0 && (
                <div>
                    <div>PROJECTS</div>
                    <br />
                    <div>
                        {projectList.map((p) => (
                            <a href={p.$id} key={p.$id}>
                                <div key={p.$id}>{p.name}</div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
