import Editor from '@/components/editor/menu-floating/editor';

export default async function DocumentId({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const documentId = (await params).id;

    const content: string =
        '<p>Hello World! 🌎️ - PINGUINI TATTICI NUCLEARI</p>';

    return (
        <div className="min-h-screen w-full">
            <Editor content={content} />
        </div>
    );
}
