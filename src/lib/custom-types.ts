export const customArraySeparator =
    process.env.NEXT_PUBLIC_CUSTOM_ARRAY_SEPARATOR || '&%&';

export type RegisterFormState = {
    status?: number;
    message?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

export type LoginFormState = {
    status?: number;
    message?: string;
    email?: string;
    password?: string;
};

export type NewProjectFormState = {
    status?: number;
    message?: string;
    name?: string;
    private?: boolean;
    image?: string;
    type?: string;
    tags?: string[];
    description?: string;
};

export class User {
    name: string;
    email: string;
    avatar: string;
    $id: string;

    constructor(data: {
        name: string;
        email: string;
        avatar: string;
        $id: string;
    }) {
        this.name = data.name;
        this.email = data.email;
        this.avatar = data.avatar;
        this.$id = data.$id;
    }

    static fromObject(data: any) {
        return new User(data);
    }

    static toObject(user: User) {
        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            $id: user.$id,
        };
    }
}

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
                const projectUrl = `/${projectId}`;
                const isProjectActive = true;

                return {
                    title: projectId,
                    url: projectUrl,
                    icon: 'folder',
                    isActive: isProjectActive,
                    items: docs.map((d) => ({
                        title: d.title || 'Untitled Document',
                        url: `/${projectId}/${d.$id}`,
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
            url: `/${d.projectId}`,
            icon: 'folder',
            isActive: true,
            items: d.documents.map((doc) => ({
                title: doc.title,
                url: `/${d.projectId}/${doc.$id}`,
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
    title: string;
    fileId: string;
    drafts?: string[];
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;

    constructor(data: {
        userId: string;
        projectId: string;
        title: string;
        fileId: string;
        drafts?: string[];
        $id: string;
        $createdAt: string | Date;
        $updatedAt: string | Date;
    }) {
        this.userId = data.userId;
        this.projectId = data.projectId;
        this.title = data.title;
        this.fileId = data.fileId;
        this.drafts = data.drafts;
        this.$id = data.$id;
        this.$createdAt = new Date(data.$createdAt);
        this.$updatedAt = new Date(data.$updatedAt);
    }

    static fromObject(rows: any[]): DbDocumentRow[] {
        if (!rows || !Array.isArray(rows)) return [];
        return rows.map((r) => new DbDocumentRow(r));
    }
}

export class DbProjectRow {
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

    constructor(data: {
        userId: string;
        name: string;
        private: boolean;
        image: string;
        type: string;
        tags?: string[];
        description?: string;
        $id: string;
        $createdAt: string | Date;
        $updatedAt: string | Date;
    }) {
        this.userId = data.userId;
        this.name = data.name;
        this.private = data.private;
        this.image = data.image;
        this.type = data.type;
        this.tags = data.tags;
        this.description = data.description;
        this.$id = data.$id;
        this.$createdAt = new Date(data.$createdAt);
        this.$updatedAt = new Date(data.$updatedAt);
    }

    static fromObject(rows: any[]): DbProjectRow[] {
        if (!rows || !Array.isArray(rows)) return [];
        return rows.map((r) => new DbProjectRow(r));
    }
}

export class DbDraftRow {
    userId: string;
    documentId: string;
    fileIdMain: string;
    fileIdDraft: string;
    fileIdSeparation: string;
    version: number;
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;

    constructor(data: {
        userId: string;
        documentId: string;
        fileIdMain: string;
        fileIdDraft: string;
        fileIdSeparation: string;
        version: number;
        $id: string;
        $createdAt: string | Date;
        $updatedAt: string | Date;
    }) {
        this.userId = data.userId;
        this.documentId = data.documentId;
        this.fileIdMain = data.fileIdMain;
        this.fileIdDraft = data.fileIdDraft;
        this.fileIdSeparation = data.fileIdSeparation;
        this.version = data.version;
        this.$id = data.$id;
        this.$createdAt = new Date(data.$createdAt);
        this.$updatedAt = new Date(data.$updatedAt);
    }

    static fromObject(rows: any[]): DbDraftRow[] {
        if (!rows || !Array.isArray(rows)) return [];
        return rows.map((r) => new DbDraftRow(r));
    }
}

export class FileMetadata {
    $id: string;
    bucketId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    name: string;
    signature: string;
    mimeType: string;
    sizeOriginal: number;
    chunksTotal: number;
    chunksUploaded: number;

    constructor(data: {
        $id: string;
        bucketId: string;
        $createdAt: string;
        $updatedAt: string;
        $permissions: string[];
        name: string;
        signature: string;
        mimeType: string;
        sizeOriginal: number;
        chunksTotal: number;
        chunksUploaded: number;
    }) {
        this.$id = data.$id;
        this.bucketId = data.bucketId;
        this.$createdAt = data.$createdAt;
        this.$updatedAt = data.$updatedAt;
        this.$permissions = data.$permissions;
        this.name = data.name;
        this.signature = data.signature;
        this.mimeType = data.mimeType;
        this.sizeOriginal = data.sizeOriginal;
        this.chunksTotal = data.chunksTotal;
        this.chunksUploaded = data.chunksUploaded;
    }

    static fromObject(data: any) {
        return new FileMetadata(data);
    }

    static fromObjectArray(data: any[]) {
        return data.map((d) => new FileMetadata(d));
    }

    toObject() {
        return {
            $id: this.$id,
            bucketId: this.bucketId,
            $createdAt: this.$createdAt,
            $updatedAt: this.$updatedAt,
            $permissions: this.$permissions,
            name: this.name,
            signature: this.signature,
            mimeType: this.mimeType,
            sizeOriginal: this.sizeOriginal,
            chunksTotal: this.chunksTotal,
            chunksUploaded: this.chunksUploaded,
        };
    }
}

export class FullDocument {
    document: DbDocumentRow;
    fileMetadata: FileMetadata;
    fileContentJson: string;

    constructor(
        document: DbDocumentRow,
        fileMetadata: FileMetadata,
        fileContentJson: string
    ) {
        this.document = document;
        this.fileMetadata = fileMetadata;
        this.fileContentJson = fileContentJson;
    }

    static fromObject(data: {
        document: any;
        fileMetadata: string;
        fileContentJson: string;
    }) {
        return new FullDocument(
            new DbDocumentRow(data.document),
            FileMetadata.fromObject(data.fileMetadata),
            data.fileContentJson
        );
    }

    toObject() {
        return {
            document: this.document,
            fileMetadata: this.fileMetadata,
            fileContentJson: this.fileContentJson,
        };
    }
}

export class Project {
    project: DbProjectRow;
    documents: DbDocumentRow[];
    drafts?: DbDraftRow[];

    constructor(
        project: DbProjectRow,
        documents: DbDocumentRow[],
        drafts?: DbDraftRow[]
    ) {
        this.project = project;
        this.documents = documents;

        if (drafts) {
            this.drafts = drafts;
        }
    }

    static fromObject(data: {
        project: any;
        documents: any[];
        drafts?: any[];
    }) {
        const project = new Project(
            new DbProjectRow(data.project),
            DbDocumentRow.fromObject(data.documents)
        );

        if (data.drafts) {
            const drafts = DbDraftRow.fromObject(data.drafts);
            project.drafts = drafts;
        }

        return project;
    }

    toObject() {
        return {
            project: this.project,
            documents: this.documents,
            drafts: this.drafts,
        };
    }
}

export type UserDataFullObject = {
    user: {
        name: string;
        email: string;
        avatar: string;
        $id: string;
    };
    projects: {
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
        documents: {
            userId: string;
            projectId: string;
            title: string;
            fileId: string;
            drafts?: string[];
            $id: string;
            $createdAt: Date;
            $updatedAt: Date;
        }[];
        drafts?: {
            userId: string;
            documentId: string;
            fileIdMain: string;
            fileIdDraft: string;
            fileIdSeparation: string;
            version: number;
            $id: string;
            $createdAt: Date;
            $updatedAt: Date;
        }[];
    }[];
};

export class UserDataFull {
    user: User;
    projects: Project[];

    constructor(user: User, projects: Project[]) {
        this.user = user;
        this.projects = projects;
    }

    static empty(): UserDataFull {
        return new UserDataFull(
            new User({
                name: '',
                email: '',
                avatar: '',
                $id: '',
            }),
            []
        );
    }

    static fromObject(data: { user: any; projects: any[] }) {
        return new UserDataFull(
            new User(data.user),
            data.projects.map(
                (p) => new Project(p.project, p.documents, p?.drafts)
            )
        );
    }

    /* user: {
        name: string;
        email: string;
        avatar: string;
        $id: string;
    };
    projects: {
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
        documents: {
            userId: string;
            projectId: string;
            title: string;
            fileId: string;
            drafts?: string[];
            $id: string;
            $createdAt: Date;
            $updatedAt: Date;
        }[];
        drafts?: {
            userId: string;
            documentId: string;
            fileIdMain: string;
            fileIdDraft: string;
            fileIdSeparation: string;
            version: number;
            $id: string;
            $createdAt: Date;
            $updatedAt: Date;
        }[];
    }[]; */
    /* 
    project: DbProjectRow;
    documents: DbDocumentRow[];
    drafts?: DbDraftRow[];
    */
    static fromUserDataFullObject(userDataFullObject: UserDataFullObject) {
        const user = new User(userDataFullObject.user);
        const projects = userDataFullObject.projects.map((p) => ({
            project: new DbProjectRow(p.project),
            documents: DbDocumentRow.fromObject(p.documents),
            drafts: DbDraftRow.fromObject(p.drafts ?? []),
        }));
        const projectsArr = projects.map(
            (p) => new Project(p.project, p.documents, p.drafts)
        );

        return new UserDataFull(user, projectsArr);
    }

    toNavMainItems() {
        const navMain: {
            title: string;
            url: string;
            icon?: string;
            isActive: boolean;
            items?: {
                title: string;
                url: string;
            }[];
        }[] = this.projects.map((p) => ({
            title: 'Projects',
            url: `/${p.project.$id}`,
            icon: 'folder',
            isActive: true,
            items: p.documents.map((d) => ({
                title: d.title || 'Untitled Document',
                url: `/${p.project.$id}/${d.$id}`,
            })),
        }));

        return navMain;
    }

    toObject() {
        const userDataFullObj: UserDataFullObject = {
            user: {
                name: this.user.name,
                email: this.user.email,
                avatar: this.user.avatar,
                $id: this.user.$id,
            },
            projects: this.projects.map((p) => ({
                project: {
                    userId: p.project.userId,
                    name: p.project.name,
                    private: p.project.private,
                    image: p.project.image,
                    type: p.project.type,
                    tags: p.project.tags,
                    description: p.project.description,
                    $id: p.project.$id,
                    $createdAt: p.project.$createdAt,
                    $updatedAt: p.project.$updatedAt,
                },
                documents: p.documents.map((d) => ({
                    userId: d.userId,
                    projectId: d.projectId,
                    title: d.title,
                    fileId: d.fileId,
                    drafts: d.drafts,
                    $id: d.$id,
                    $createdAt: d.$createdAt,
                    $updatedAt: d.$updatedAt,
                })),
                drafts: p.drafts?.map((d) => ({
                    userId: d.userId,
                    documentId: d.documentId,
                    fileIdMain: d.fileIdMain,
                    fileIdDraft: d.fileIdDraft,
                    fileIdSeparation: d.fileIdSeparation,
                    version: d.version,
                    $id: d.$id,
                    $createdAt: d.$createdAt,
                    $updatedAt: d.$updatedAt,
                })),
            })),
        };

        return userDataFullObj;
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
            drafts: string[];
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
                    drafts: doc.drafts ?? [],
                    $id: doc.$id,
                    $createdAt: doc.$createdAt,
                    $updatedAt: doc.$updatedAt,
                })),
            };
        });

        return userData;
    }

    static fromObject(data: {
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
                drafts: string[];
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
