import { Project } from "../types/project";
import { FirebaseProjectBackend } from "./project/FirebaseProjectBackend";
import { LocalStorageProjectBackend } from "./project/LocalstorageProjectBackend";
import { eventBus, APP_EVENTS } from "@/utils/eventBus";
import { StorageType } from "../settings"; 

export class ProjectService {
    private static getBackend() {
        const currentStorage: StorageType = (localStorage.getItem("storage_type") as StorageType) || "firebase";
        
        if (currentStorage === "local") {
            return LocalStorageProjectBackend;
        }
        return FirebaseProjectBackend;
    }

    static async getAll(): Promise<Project[]> {
        return await this.getBackend().getAll();
    }

    static async getById(id: string): Promise<Project | undefined> {
        return await this.getBackend().getById(id);
    }

    static async create(project: Project): Promise<void> {
        try {
            await this.getBackend().create(project);

            eventBus.emit(APP_EVENTS.PROJECT_CREATED, project);
            
        } catch (e) {
            console.error("Błąd w ProjectService.create:", e);
        }
    }

    static async update(updatedProject: Project): Promise<void> {
        await this.getBackend().update(updatedProject);
    }

    static async delete(id: string): Promise<void> {
        await this.getBackend().delete(id);
    }
}