import { user } from '@/auth/user';
import {
    DbDocumentRow,
    DbProjectRow,
    Project,
    UserData,
} from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { map } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        user.sessionCookie = (await cookies()).get('session');

        const userId = (await params).userId;

        const { authenticatedUser, database } = await user.getUserAndDb();

        const queries: string[] = [];
        queries.push(Query.equal('userId', userId));
        queries.push(Query.orderDesc('$updatedAt'));
        if (authenticatedUser?.$id !== userId) {
            queries.push(Query.equal('public', true));
        }

        // get the user projects
        const projectRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_PROJECTS || '',
            queries: queries,
        });
        const projects = DbProjectRow.fromObject(projectRows.rows);

        if (projects.length === 0) {
            return Response.json({
                status: 404,
                message: 'Projects not found',
            });
        }

        queries.length = 0;
        queries.push(
            Query.contains(
                'projectId',
                projects.map((project) => project.$id)
            )
        );
        queries.push(Query.equal('userId', userId));
        queries.push(Query.orderDesc('$updatedAt'));

        // get all user documents
        const docRows = await database.listRows({
            databaseId: process.env.NEXT_PUBLIC_DATABASE_ID || '',
            tableId: process.env.NEXT_PUBLIC_COLLECTION_DOCUMENTS || '',
            queries: queries,
        });
        const documents = DbDocumentRow.fromObject(docRows.rows);

        const projectsObject: Project[] = [];
        projects.map((project) => {
            const projectDocuments = documents.filter(
                (doc) => doc.projectId === project.$id
            );
            projectsObject.push(new Project(project, projectDocuments));
        });

        /* TODO: return proper reponse with error management */
        /* return new NextResponse(JSON.stringify({ projectsObject }), {
            status: 200,
            statusText: 'OK'
        }); */
        return Response.json({ projectsObject });
    } catch (error) {
        return Response.json({
            status: 500,
            message: 'Error while fetching data',
        });
    }
}
