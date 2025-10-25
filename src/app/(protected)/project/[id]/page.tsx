export default async function DocumentId({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const documentId = (await params).id;

    return (
        <div className="flex flex-col items-center justify-center">
            <div>PROJECT: {documentId}</div>
        </div>
    );
}
