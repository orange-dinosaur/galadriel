import { cookies } from 'next/headers';
import { createSessionClient } from '@/appwrite/config';
import { Client, TablesDB, Storage } from 'node-appwrite';

export class AuthenticatedUser {
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;
    name: string;
    registration: Date;
    status: boolean;
    labels: string[];
    passwordUpdate: Date;
    email: string;
    phone: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    mfa: boolean;
    prefs: Record<string, unknown>;
    targets: {
        $id: string;
        $createdAt: Date;
        $updatedAt: Date;
        name: string;
        userId: string;
        providerId: string | null;
        providerType: string;
        identifier: string;
        expired: boolean;
    }[];
    accessedAt: Date;

    constructor(data?: any) {
        if (!data) {
            this.$id = '';
            this.$createdAt = new Date(0);
            this.$updatedAt = new Date(0);
            this.name = '';
            this.registration = new Date(0);
            this.status = false;
            this.labels = [];
            this.passwordUpdate = new Date(0);
            this.email = '';
            this.phone = '';
            this.emailVerification = false;
            this.phoneVerification = false;
            this.mfa = false;
            this.prefs = {};
            this.targets = [];
            this.accessedAt = new Date(0);
            return;
        }

        this.$id = data.$id ?? '';
        this.$createdAt = data.$createdAt
            ? new Date(data.$createdAt)
            : new Date(0);
        this.$updatedAt = data.$updatedAt
            ? new Date(data.$updatedAt)
            : new Date(0);
        this.name = data.name ?? '';
        this.registration = data.registration
            ? new Date(data.registration)
            : new Date(0);
        this.status = Boolean(data.status);
        this.labels = Array.isArray(data.labels) ? data.labels : [];
        this.passwordUpdate = data.passwordUpdate
            ? new Date(data.passwordUpdate)
            : new Date(0);
        this.email = data.email ?? '';
        this.phone = data.phone ?? '';
        this.emailVerification = Boolean(data.emailVerification);
        this.phoneVerification = Boolean(data.phoneVerification);
        this.mfa = Boolean(data.mfa);
        this.prefs = data.prefs ?? {};
        this.targets = Array.isArray(data.targets)
            ? data.targets.map((t: any) => ({
                  $id: t.$id ?? '',
                  $createdAt: t.$createdAt
                      ? new Date(t.$createdAt)
                      : new Date(0),
                  $updatedAt: t.$updatedAt
                      ? new Date(t.$updatedAt)
                      : new Date(0),
                  name: t.name ?? '',
                  userId: t.userId ?? '',
                  providerId: t.providerId ?? null,
                  providerType: t.providerType ?? '',
                  identifier: t.identifier ?? '',
                  expired: Boolean(t.expired),
              }))
            : [];
        this.accessedAt = data.accessedAt
            ? new Date(data.accessedAt)
            : new Date(0);
    }

    static empty(): AuthenticatedUser {
        return new AuthenticatedUser();
    }
}

export const user: {
    user: AuthenticatedUser;
    database: TablesDB;
    storage: Storage;
    sessionCookie: any;
    getUser: () => Promise<AuthenticatedUser>;
    getUserAndDb: () => Promise<{
        authenticatedUser: AuthenticatedUser;
        database: TablesDB;
    }>;
    getUserAndDbAndStorage: () => Promise<{
        authenticatedUser: AuthenticatedUser;
        database: TablesDB;
        storage: Storage;
    }>;
} = {
    user: new AuthenticatedUser(),
    database: new TablesDB(new Client()),
    storage: new Storage(new Client()),
    sessionCookie: undefined,

    getUser: async () => {
        user.sessionCookie = (await cookies()).get('session') || null;

        try {
            const { account } = await createSessionClient(
                user.sessionCookie?.value || ''
            );

            const userData = await account.get();
            user.user = new AuthenticatedUser(userData);
        } catch {
            user.user = AuthenticatedUser.empty();
            user.sessionCookie = null;
        }

        return user.user;
    },

    getUserAndDb: async () => {
        user.sessionCookie = (await cookies()).get('session') || null;

        try {
            const { account, database } = await createSessionClient(
                user.sessionCookie?.value || ''
            );

            const userData = await account.get();
            user.user = new AuthenticatedUser(userData);

            user.database = database;
        } catch {
            user.user = AuthenticatedUser.empty();
            user.sessionCookie = null;
        }

        return { authenticatedUser: user.user, database: user.database };
    },

    getUserAndDbAndStorage: async () => {
        user.sessionCookie = (await cookies()).get('session') || null;

        try {
            const { account, database, storage } = await createSessionClient(
                user.sessionCookie?.value || ''
            );

            const userData = await account.get();
            user.user = new AuthenticatedUser(userData);

            user.database = database;

            user.storage = storage;
        } catch {
            user.user = AuthenticatedUser.empty();
            user.sessionCookie = null;
        }

        return {
            authenticatedUser: user.user,
            database: user.database,
            storage: user.storage,
        };
    },
};
