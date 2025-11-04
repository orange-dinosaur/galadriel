import axios from 'axios';
import { cookies } from 'next/headers';

const axiosInstance = async (url: string, method: string, body?: any) => {
    const sessionCookie = (await cookies()).get('session');
    const headers = {
        Cookie: `session=${sessionCookie?.value}`,
    };

    return axios({
        url,
        method,
        headers,
        data: body,
        withCredentials: true,
    });
};

export default axiosInstance;
