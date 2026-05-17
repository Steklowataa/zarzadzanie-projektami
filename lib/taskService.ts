import { Task } from "../types/task";
import { StoryService } from "./storyServices";
import { FirebaseTaskBackend } from "./task/FirebaseTaskBackend";
import { LocalStorageTaskBackend } from "./task/LocalstorageBackend";
import { eventBus, APP_EVENTS } from "@/utils/eventBus";
import { StorageType } from "../settings";

export class TaskService {
    private static getBackend() {
        const currentStorage: StorageType = (localStorage.getItem("storage_type") as StorageType) || "firebase";
        return currentStorage === "local" ? LocalStorageTaskBackend : FirebaseTaskBackend;
    }

    static async getAllByStory(storyId: string): Promise<Task[]> {
        return await this.getBackend().getAllByStory(storyId);
    }

    static async getById(taskId: string) {
        return await this.getBackend().getById(taskId);
    }

    static async create(task: Task): Promise<void> {
        await this.getBackend().create(task);
        const story = await StoryService.getById(task.storyId);
        if (story && story.status === "todo") {
            await StoryService.edit({ ...story, status: "in progress" });
        }

        eventBus.emit(APP_EVENTS.TASK_CREATED, {
            taskName: task.name,
            recipientId: task.ownerId
        });
    }

    static async assignUser(taskId: string, userId: string): Promise<void> {
        await this.getBackend().updateAssignment(taskId, userId);

        const task = await this.getById(taskId);
        if (!task) return;

        const story = await StoryService.getById(task.storyId);
        if (story && story.status !== "in progress") {
            await StoryService.edit({ ...story, status: "in progress" });
        }

        if (story?.ownerId) {
            eventBus.emit(APP_EVENTS.TASK_ASSIGNED, {
                taskName: task.name,
                assigneeId: userId
            });
        }
    }

    static async completeTask(taskId: string): Promise<void> {
        await this.getBackend().completeTask(taskId);

        const task = await this.getById(taskId);
        if (!task) return;

        const tasks = await this.getAllByStory(task.storyId);
        const allDone = tasks.length > 0 && tasks.every(t => t.status === "done");

        if (allDone) {
            const story = await StoryService.getById(task.storyId);
            if (story && story.status !== "done") {
                await StoryService.edit({ ...story, status: "done" });
            }
        } else {
            const story = await StoryService.getById(task.storyId);
            if (story && story.status !== "in progress") {
                await StoryService.edit({ ...story, status: "in progress" });
            }
        }

        eventBus.emit(APP_EVENTS.TASK_STATUS_CHANGED, {
            taskName: task.name,
            oldStatus: "in progress",
            newStatus: "done",
            recipientId: task.assignUserId || task.ownerId
        });
    }

    static async delete(taskId: string): Promise<void> {
        const task = await this.getById(taskId);
        
        await this.getBackend().delete(taskId);

        if (task) {
            eventBus.emit(APP_EVENTS.TASK_DELETED, {
                taskName: task.name,
                recipientId: task.ownerId
            });
        }
    }
}