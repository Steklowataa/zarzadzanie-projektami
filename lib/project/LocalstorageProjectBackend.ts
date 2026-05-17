import { Project } from "../../types/project";

export class LocalStorageProjectBackend {
    private static storageKey = "projects";

    private static getRawProjects(): Project[] {
        if (typeof window === "undefined") return []; 
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    static async getAll(): Promise<Project[]> {
        return this.getRawProjects();
    }

    static async getById(id: string): Promise<Project | undefined> {
        return this.getRawProjects().find(p => p.id === id);
    }

    static async create(project: Project): Promise<void> {
        const projects = this.getRawProjects();
        projects.push(project);
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }

    static async update(updatedProject: Project): Promise<void> {
        const projects = this.getRawProjects();
        const index = projects.findIndex(p => p.id === updatedProject.id);
        if (index !== -1) {
            projects[index] = updatedProject;
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
        }
    }

    static async delete(id: string): Promise<void> {
        const projects = this.getRawProjects();
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        
    
    }
}