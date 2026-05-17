import { Story } from "../types/story";
import { FirebaseStoryBackend } from "./story/FirebaseStoryBackend";
import { LocalStorageStoryBackend } from "./story/LocalstorageStoryBackend";
import { eventBus, APP_EVENTS } from "@/utils/eventBus";
import { StorageType } from "../settings"; 

export class StoryService {
    private static getBackend() {
        const currentStorage: StorageType = (localStorage.getItem("storage_type") as StorageType) || "firebase";
        return currentStorage === "local" ? LocalStorageStoryBackend : FirebaseStoryBackend;
    }

    static async getAllByProject(projectId: string): Promise<Story[]> {
        return await this.getBackend().getAllByProject(projectId);
    }

    static async getById(id: string): Promise<Story | undefined> {
        return await this.getBackend().getById(id);
    }

    static async create(story: Story): Promise<void> {
        await this.getBackend().create(story);
    }

    static async edit(updatedStory: Story): Promise<void> {
        await this.getBackend().update(updatedStory);
        eventBus.emit(APP_EVENTS.STORY_TASK_MODIFIED, {
            storyName: updatedStory.name,
            recipientId: updatedStory.ownerId
        });
    }

    static async delete(storyId: string): Promise<void> {
        await this.getBackend().delete(storyId);
    }
}