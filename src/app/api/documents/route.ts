import { createSessionClient } from '@/appwrite/config';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';

export async function GET() {
    try {
        const sessionCookie = (await cookies()).get('session');

        const { account, database } = await createSessionClient(
            sessionCookie?.value || ''
        );
        const user = await account.get();

        const rows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: [Query.equal('userId', user.$id)],
        });

        return Response.json({ rows });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Access DENIED', status: 403 });
    }
}
