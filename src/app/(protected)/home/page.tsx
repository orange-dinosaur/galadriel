import { deleteSession } from '@/auth/session';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';

export default async function Home() {
    const response = await axiosInstance(
        'http://localhost:3000/api/documents',
        'get'
    );

    const data = response.data;

    return (
        <div>
            <div>DOCUMENTS</div>
            <br />
            <div>
                {data.rows.rows.map((row: any) => (
                    <a href={`/document/${row.$id}`} key={row.$id}>
                        <div key={row.$id}>{row.$id}</div>
                    </a>
                ))}
            </div>
            <br />
            <br />

            <form action={deleteSession}>
                <Button type="submit" className="cursor-pointer">
                    Logout
                </Button>
            </form>
        </div>
    );
}
