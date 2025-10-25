import { LucideIcon } from 'lucide-react';

export type RegisterFormState = {
    code?: number;
    message?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

export type LoginFormState = {
    code?: number;
    message?: string;
    email?: string;
    password?: string;
};

export class AppSidebarData {
    user: {
        name: string;
        email: string;
        avatar: string;
    };

    navMain: {
        title: string;
        url: string;
        icon?: string;
        isActive: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];

    constructor(
        user?: {
            name: string;
            email: string;
            avatar: string;
        },
        navMain?: {
            title: string;
            url: string;
            icon?: string;
            isActive: boolean;
            items?: {
                title: string;
                url: string;
            }[];
        }[]
    ) {
        this.user = user ?? {
            name: '',
            email: '',
            avatar: '',
        };

        this.navMain = navMain ?? [];
    }

    static fromUserAndDocuments(
        user: {
            name: string;
            email: string;
            avatar: string;
        },
        documents: DbDocumentRow[],
        currentPath = ''
    ): AppSidebarData {
        return new AppSidebarData(
            user,
            this.buildNavMain(documents, currentPath)
        );
    }

    private static buildNavMain(documents: DbDocumentRow[], currentPath = '') {
        if (!documents || documents.length === 0) return [];

        // Group by projectId
        const projectMap = new Map<string, DbDocumentRow[]>();
        for (const doc of documents) {
            if (!projectMap.has(doc.projectId)) {
                projectMap.set(doc.projectId, []);
            }
            projectMap.get(doc.projectId)!.push(doc);
        }

        // Build each project group
        const navMain = Array.from(projectMap.entries()).map(
            ([projectId, docs]) => {
                const projectUrl = `/project/${projectId}`;
                const isProjectActive = true;

                return {
                    title: projectId,
                    url: projectUrl,
                    icon: 'folder',
                    isActive: isProjectActive,
                    items: docs.map((d) => ({
                        title: d.title || 'Untitled Document',
                        url: `/document/${d.$id}`,
                    })),
                };
            }
        );

        return navMain;
    }

    static empty(): AppSidebarData {
        return new AppSidebarData();
    }

    toObject() {
        return {
            user: this.user,
            navMain: this.navMain,
        };
    }
}

export class DbDocumentRow {
    projectId: string;
    title?: string;
    slug?: string;
    editorKind?: string;
    content?: string;
    contentFormat?: string;
    versionCounter?: number;
    lastCommitedAt?: Date;
    userId: string;
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;

    constructor(data: {
        projectId: string;
        title?: string;
        slug?: string;
        editorKind?: string;
        content?: string;
        contentFormat?: string;
        versionCounter?: number;
        lastCommitedAt?: string | Date;
        userId: string;
        $id: string;
        $createdAt: string | Date;
        $updatedAt: string | Date;
    }) {
        this.projectId = data.projectId;
        this.title = data.title;
        this.slug = data.slug;
        this.editorKind = data.editorKind;
        this.content = data.content;
        this.contentFormat = data.contentFormat;
        this.versionCounter = data.versionCounter;
        this.lastCommitedAt = data.lastCommitedAt
            ? new Date(data.lastCommitedAt)
            : undefined;
        this.userId = data.userId;
        this.$id = data.$id;
        this.$createdAt = new Date(data.$createdAt);
        this.$updatedAt = new Date(data.$updatedAt);
    }

    static fromApiResponse(rows: any[]): DbDocumentRow[] {
        if (!rows || !Array.isArray(rows)) return [];
        return rows.map((r) => new DbDocumentRow(r));
    }
}
