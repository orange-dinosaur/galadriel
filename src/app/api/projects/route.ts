import { createSessionClient } from '@/appwrite/config';
import { user } from '@/auth/user';
import { DbDocumentRow, DbProjectRow, UserData } from '@/lib/custom-types';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Query } from 'node-appwrite';

export async function POST(request: NextRequest) {
    try {
    } catch (error) {
        return Response.json({ message: 'Access DENIED', status: 403 });
    }
}
