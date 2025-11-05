import { createSessionClient } from '@/appwrite/config';
import { user } from '@/auth/user';
import { DbDocumentRow, DbProjectRow, UserData } from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId'); // e.g. `/api/documents?projectId=hello`

        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database } = await user.getUserAndDb();

        const queries: string[] = [];

        if (userId && userId !== authenticatedUser.$id) {
            queries.push(Query.equal('userId', userId));
            queries.push(Query.equal('public', true));
        } else {
            queries.push(Query.equal('userId', authenticatedUser.$id));
        }

        // get all user projects
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            queries: queries,
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        queries.length = 0;
        queries.push(
            Query.contains(
                'projectId',
                projects.map((p) => p.$id)
            )
        );
        queries.push(
            Query.equal(
                'userId',
                userId && userId !== authenticatedUser.$id
                    ? userId
                    : authenticatedUser.$id
            )
        );
        queries.push(Query.orderAsc('projectId'));

        // get all user documents
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        const userData: UserData = UserData.fromDbSearchResult(
            projects,
            documents
        );

        return Response.json({ userData });
    } catch (error) {
        return Response.json({ message: 'Access DENIED', status: 403 });
    }
}
