import axiosInstance from '@/lib/axiosInstance';
import { DbDocumentRow } from '@/lib/custom-types';

export default async function Home() {
    const response = await axiosInstance(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/documents`,
        'get'
    );

    const d = response.data.documents;
    const documents = DbDocumentRow.fromApiResponse(d);

    const randomQuote = await axiosInstance(
        process.env.NEXT_PUBLIC_RANDOM_BOOK_QUOTE_ENDPOINT ?? '',
        'get'
    );
    const quote = randomQuote.data.quote ?? 'Book quote not found.';
    const title = randomQuote.data.book ?? 'Title not found.';
    const author = randomQuote.data.author ?? 'Author not found.';

    return (
        <>
            {documents.length === 0 && (
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
            {documents.length !== 0 && (
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
            )}
        </>
    );
}
