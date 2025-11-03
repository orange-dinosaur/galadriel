import { createSessionClient } from '@/appwrite/config';
import { user } from '@/auth/user';
import { DbDocumentRow, DbProjectRow, UserData } from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const projectId = (await params).id;

        user.sessionCookie = (await cookies()).get('session');

        const { authenticatedUser, database } = await user.getUserAndDb();

        const queries: string[] = [];
        queries.push(Query.equal('$id', projectId));

        // get the user project
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            queries: queries,
        });
        const projects = DbProjectRow.fromApiResponse(projectRows.rows);

        if (projects.length === 0) {
            return Response.json({ message: 'Project not found', status: 404 });
        }

        if (!projects[0].public) {
            if (authenticatedUser?.$id !== projects[0].userId) {
                return Response.json({
                    message: 'Access DENIED',
                    status: 403,
                });
            }
        }

        queries.length = 0;
        queries.push(Query.equal('projectId', projectId));
        queries.push(Query.orderDesc('$createdAt'));

        // get all user documents
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromApiResponse(docRows.rows);

        const userData: UserData = UserData.fromDbSearchResult(
            projects,
            documents
        );

        return Response.json({ userData });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Access DENIED', status: 403 });
    }
}
