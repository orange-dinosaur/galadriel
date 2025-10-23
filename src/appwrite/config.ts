import { Client, TablesDB, Account } from 'node-appwrite';

const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT || '')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID || '')
        .setKey(process.env.NEXT_PUBLIC_API_KEY || '');

    return {
        get account() {
            return new Account(client);
        },

        get database() {
            return new TablesDB(client);
        },
    };
};

const createSessionClient = async (session: string) => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT || '')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID || '');

    if (session) {
        client.setSession(session);
    }

    return {
        get account() {
            return new Account(client);
        },

        get database() {
            return new TablesDB(client);
        },
    };
};

export { createAdminClient, createSessionClient };
