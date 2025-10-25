import axiosInstance from '@/lib/axiosInstance';
import { DbDocumentRow } from '@/lib/custom-types';

export default async function ProjectId({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const projectId = (await params).id;

    const response = await axiosInstance(
        `http://localhost:3000/api/documents?projectId=${projectId}`,
        'get'
    );

    const d = response.data.documents;
    const documents = DbDocumentRow.fromApiResponse(d);

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
