import { ProjectCard } from '@/components/projects/project-card';
import { getAllProjectsOfUser } from '@/db/projects';
import axiosInstance from '@/lib/axiosInstance';
import { Project, UserDataFull } from '@/lib/custom-types';

export default async function Home({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const userId = (await params).userId;

    /* TODO: get other user data other than id */

    const response = await getAllProjectsOfUser(userId);

    let data: UserDataFull;
    if (response.data === 200 && response.data) {
        const projects: Project[] = response.data.map((project: any) => {
            return Project.fromObject(project);
        });

        data = UserDataFull.fromObject({
            user: {
                name: '',
                email: '',
                avatar: process.env.NEXT_PUBLIC_AVATAR_ENDPOINT + userId,
                $id: userId,
            },
            projects: projects,
        });
    } else {
        data = UserDataFull.fromObject({
            user: {
                name: '',
                email: '',
                avatar: process.env.NEXT_PUBLIC_AVATAR_ENDPOINT + userId,
                $id: userId,
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
                    <div>{data.user.name}</div>
                    <br />
                    <div>
                        {data.projects.length !== 0 && (
                            <div className="flex gap-6">
                                {projectList.map((p) => (
                                    <ProjectCard key={p.$id} project={p} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
