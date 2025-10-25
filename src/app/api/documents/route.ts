import { createSessionClient } from '@/appwrite/config';
import { user } from '@/auth/user';
import { DbDocumentRow } from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const project = searchParams.get('projectId'); // e.g. `/api/documents?projectId=hello`

        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database } = await user.getUserAndDb();

        const queries: string[] = [
            Query.equal('userId', authenticatedUser.$id),
        ];
        if (project) {
            queries.push(Query.equal('projectId', project));
        } else {
            queries.push(Query.orderAsc('projectId'));
        }

        const rows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });

        const documents = DbDocumentRow.fromApiResponse(rows.rows);

        return Response.json({ documents });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Access DENIED', status: 403 });
    }
}
