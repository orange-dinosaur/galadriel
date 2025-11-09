import { DocumentCard } from '@/components/documents/document-card';
import { ProjectCard } from '@/components/projects/project-card';
import { getProjectById } from '@/db/projects';
import axiosInstance from '@/lib/axiosInstance';
import { DbDocumentRow, Project, UserData } from '@/lib/custom-types';
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
        <div>
            <div className="flex items-center pt-4 pb-8 gap-4">
                <p className="text-2xl">{project.project.name}</p>
                {project.project.private ? (
                    <EyeOffIcon className="max-w-4 max-h-4 font-bold" />
                ) : (
                    <EyeIcon className="max-w-4 max-h-4 font-bold" />
                )}
            </div>

            <div className="flex gap-6">
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
