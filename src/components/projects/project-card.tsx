import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DbProjectRow } from '@/lib/custom-types';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';

export function ProjectCard({ project }: { project: DbProjectRow }) {
    return (
        <Link href={`/${project.$id}`}>
            <Card className="w-max-[250px] w-[250px] h-max-[350px] h-[350px] p-0 bg-secondary rounded-lg shadow-lg gap-0">
                <CardHeader className="p-0">
                    <img
                        className="w-max-[250px] w-[250px] h-max-[200px] h-[200px] object-cover rounded-t-lg shadow-lg"
                        alt="project cover"
                        src={project.image}
                    />
                </CardHeader>
                <CardContent className="pt-3">
                    <span className="flex items-center gap-3">
                        <CardTitle>{project.name}</CardTitle>
                        {project.private ? (
                            <EyeOffIcon className="max-w-3 max-h-3 font-bold" />
                        ) : (
                            <EyeIcon className="max-w-3 max-h-3 font-bold" />
                        )}
                    </span>
                    <Badge className="font-bold bg-blue-500 text-white mt-4 mb-5">
                        {project.type}
                    </Badge>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-1 overflow-y-scroll overflow-x-hidden pb-2">
                    {project.tags?.map((t) => (
                        <Badge key={t} className="text-[10px] font-bold">
                            {t}
                        </Badge>
                    ))}
                </CardFooter>
                <div className="mt-1.5"></div>
            </Card>
        </Link>
    );
}
