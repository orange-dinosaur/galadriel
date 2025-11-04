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

export type NewProjectFormState = {
    code?: number;
    message?: string;
    name?: string;
    private?: boolean;
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

    static fromUserData(userData: UserData): AppSidebarData {
        const appSidebarData = new AppSidebarData();

        appSidebarData.user = userData.user;
        appSidebarData.navMain = this.buildNavMainFromUserData(userData);

        return appSidebarData;
    }

    private static buildNavMainFromUserData(userData: UserData) {
        if (!userData || !userData.data) return [];

        const data = userData.data;

        const navMain = data.map((d) => ({
            title: d.projectName,
            url: `/project/${d.projectId}`,
            icon: 'folder',
            isActive: true,
            items: d.documents.map((doc) => ({
                title: doc.title,
                url: `/document/${doc.$id}`,
            })),
        }));

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
    userId: string;
    projectId: string;
    title?: string;
    fileId?: string;
    version?: number;
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;

    constructor(data: {
        userId: string;
        projectId: string;
        projectName?: string;
        title?: string;
        fileId?: string;
        version?: number;
        $id: string;
        $createdAt: string | Date;
        $updatedAt: string | Date;
    }) {
        this.userId = data.userId;
        this.projectId = data.projectId;
        this.title = data.title;
        this.fileId = data.fileId;
        this.version = data.version;
        this.$id = data.$id;
        this.$createdAt = new Date(data.$createdAt);
        this.$updatedAt = new Date(data.$updatedAt);
    }

    static fromApiResponse(rows: any[]): DbDocumentRow[] {
        if (!rows || !Array.isArray(rows)) return [];
        return rows.map((r) => new DbDocumentRow(r));
    }
}

export class DbProjectRow {
    userId: string;
    name: string;
    public: boolean;
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;

    constructor(data: {
        userId: string;
        name: string;
        public: boolean;
        $id: string;
        $createdAt: string | Date;
        $updatedAt: string | Date;
    }) {
        this.userId = data.userId;
        this.name = data.name;
        this.public = data.public;
        this.$id = data.$id;
        this.$createdAt = new Date(data.$createdAt);
        this.$updatedAt = new Date(data.$updatedAt);
    }

    static fromApiResponse(rows: any[]): DbProjectRow[] {
        if (!rows || !Array.isArray(rows)) return [];
        return rows.map((r) => new DbProjectRow(r));
    }
}

export class UserData {
    user: {
        name: string;
        email: string;
        avatar: string;
    };

    data: {
        projectId: string;
        projectName: string;
        documents: {
            title: string;
            fileId: string;
            version: number;
            $id: string;
            $createdAt: Date;
            $updatedAt: Date;
        }[];
    }[];

    constructor() {
        this.user = {
            name: '',
            email: '',
            avatar: '',
        };

        this.data = [];
    }

    static fromDbSearchResult(
        projects: DbProjectRow[],
        documents: DbDocumentRow[]
    ) {
        const userData = new UserData();
        if (!projects || projects.length === 0) return userData;

        const docsByProject = new Map<string, DbDocumentRow[]>();
        if (documents && documents.length > 0) {
            for (const doc of documents) {
                const list = docsByProject.get(doc.projectId) ?? [];
                list.push(doc);
                docsByProject.set(doc.projectId, list);
            }
        }

        userData.data = projects.map((project) => {
            const projectDocuments = docsByProject.get(project.$id) ?? [];
            return {
                projectId: project.$id,
                projectName: project.name,
                documents: projectDocuments.map((doc) => ({
                    title: doc.title ?? 'Untitled Document',
                    fileId: doc.fileId ?? '',
                    version: doc.version ?? 1,
                    $id: doc.$id,
                    $createdAt: doc.$createdAt,
                    $updatedAt: doc.$updatedAt,
                })),
            };
        });

        return userData;
    }

    static fromApiResponse(data: {
        user: {
            name: string;
            email: string;
            avatar: string;
        };
        data: {
            projectId: string;
            projectName: string;
            documents: {
                title: string;
                fileId: string;
                version: number;
                $id: string;
                $createdAt: Date;
                $updatedAt: Date;
            }[];
        }[];
    }) {
        if (!data.user || !data.data) return new UserData();

        const userData = new UserData();
        userData.user = data.user;
        userData.data = data.data;

        return userData;
    }

    toObject() {
        return {
            user: this.user,
            data: this.data,
        };
    }
}
