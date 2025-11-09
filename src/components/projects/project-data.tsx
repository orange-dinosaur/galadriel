'use client';

import { Badge } from '@/components/ui/badge';

export function ProjectData({
    project,
}: {
    project: {
        userId: string;
        name: string;
        private: boolean;
        image: string;
        type: string;
        tags?: string[];
        description?: string;
        $id: string;
        $createdAt: Date;
        $updatedAt: Date;
    };
}) {
    return (
        <div>
            <div>
                <p className="h-min-4 h-4">{project.description}</p>
            </div>
            <div className="flex pt-6 gap-2">
                {project.tags?.map((t) => (
                    <Badge key={t} className="font-bold">
                        {t}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
