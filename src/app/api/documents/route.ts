import { createSessionClient } from '@/appwrite/config';
import { user } from '@/auth/user';
import { DbDocumentRow } from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';

export async function GET() {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database } = await user.getUserAndDb();

        const rows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: [
                Query.equal('userId', authenticatedUser.$id),
                Query.orderAsc('projectId'),
            ],
        });

        const documents = DbDocumentRow.fromApiResponse(rows.rows);

        return Response.json({ documents });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Access DENIED', status: 403 });
    }
}
