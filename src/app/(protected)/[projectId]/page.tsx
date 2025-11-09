import { DocumentCard } from '@/components/documents/document-card';
import { ProjectData } from '@/components/projects/project-data';
import { ProjectPageActions } from '@/components/projects/project-page-actions';
import { Badge } from '@/components/ui/badge';
import { getProjectById } from '@/db/projects';
import { Project } from '@/lib/custom-types';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default async function ProjectId({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const projectId = (await params).projectId;

    const response = await getProjectById(projectId);

    if ((response.status && response.status !== 200) || !response.data) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-muted-foreground italic mb-8 text-5xl">
                    404 - Project not found
                </p>
            </div>
        );
    }

    const project: Project = response.data;

    return (
        <div className="space-y-6 bg-background min-h-screen">
            <div className="sticky top-[calc(var(--header-height))] z-30 bg-background pt-4 pb-3 shadow-sm mt-0">
                <div className="flex items-center gap-4">
                    <p className="text-2xl">{project.project.name}</p>
                    {project.project.private ? (
                        <EyeOffIcon className="max-w-4 max-h-4 font-bold" />
                    ) : (
                        <EyeIcon className="max-w-4 max-h-4 font-bold" />
                    )}
                    <Badge className="font-bold bg-blue-500 text-white">
                        {project.project.type}
                    </Badge>
                    <ProjectPageActions
                        project={{
                            ...project.project,
                        }}
                    />
                </div>

                <div className="mt-3">
                    <ProjectData
                        project={{
                            ...project.project,
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
                <DocumentCard
                    key={'key'}
                    document={{
                        userId: '',
                        projectId: project.project.$id,
                        title: '',
                        fileId: '',
                        drafts: [],
                        $id: '',
                        $createdAt: new Date(),
                        $updatedAt: new Date(),
                    }}
                    type="add"
                />
                {project.documents.map((d) => (
                    <DocumentCard
                        key={d.$id}
                        document={d.toObject()}
                        type="display"
                    />
                ))}
            </div>
        </div>
    );
}
