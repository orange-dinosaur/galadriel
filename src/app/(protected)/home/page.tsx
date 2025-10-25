import axiosInstance from '@/lib/axiosInstance';
import { DbDocumentRow } from '@/lib/custom-types';

export default async function Home() {
    const response = await axiosInstance(
        'http://localhost:3000/api/documents',
        'get'
    );

    const d = response.data.documents;
    const documents = DbDocumentRow.fromApiResponse(d);

    return (
        <div>
            <div>DOCUMENTS</div>
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
