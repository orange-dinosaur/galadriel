import { cookies } from 'next/headers';
import { createSessionClient } from '@/appwrite/config';

const userAuth = {
    user: undefined as any,
    sessionCookie: undefined as any,

    getUser: async () => {
        userAuth.sessionCookie = (await cookies()).get('session') || null;

        try {
            const { account } = await createSessionClient(
                userAuth.sessionCookie.value || ''
            );
            userAuth.user = await account.get();
        } catch (error) {
            userAuth.user = null;
            userAuth.sessionCookie = null;
        }

        return userAuth.user;
    },
};

export default userAuth;
