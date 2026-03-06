export interface Story {
    id: string;
    name: string;
    description: string;
    status: "todo" | "in progress" | "done";
    priority: "low" | "medium" | "high";
    projectId: string;
    createdAt: string;
    ownerId: string;
}
