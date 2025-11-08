import { getProjectById } from '@/db/projects';
import axiosInstance from '@/lib/axiosInstance';
import { UserData } from '@/lib/custom-types';

export default async function ProjectId({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const projectId = (await params).projectId;

    const response = await getProjectById(projectId);

    if ((response.status && response.status !== 200) || !response.data) {
        return (
            <div>
                <div>PROEJCT {projectId} NOT FOUND</div>
            </div>
        );
    }

    const resData: UserData = UserData.fromObject(response.data);
    const documents = resData.data[0].documents;

    return (
        <div>
            <div>DOCUMENTS OF PROJECT {projectId}</div>
            <br />
            <div>
                {documents.map((doc) => (
                    <a href={`/${projectId}/${doc.$id}`} key={doc.$id}>
                        <div key={doc.$id}>{doc.$id}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
