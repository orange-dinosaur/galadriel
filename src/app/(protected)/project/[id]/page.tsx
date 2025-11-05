import axiosInstance from '@/lib/axiosInstance';
import { DbDocumentRow, UserData } from '@/lib/custom-types';

export default async function ProjectId({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const projectId = (await params).id;

    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/projects/${projectId}`,
        'get'
    );

    if (response.data.status && response.data.status !== 200) {
        return (
            <div>
                <div>PROEJCT {projectId} NOT FOUND</div>
            </div>
        );
    }

    const resData: UserData = UserData.fromObject(response.data.userData);
    const documents = resData.data[0].documents;

    return (
        <div>
            <div>DOCUMENTS OF PROJECT {projectId}</div>
            <br />
            <div>
                {documents.map((doc: any) => (
                    <a href={`/document/${doc.$id}`} key={doc.$id}>
                        <div key={doc.$id}>{doc.$id}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
