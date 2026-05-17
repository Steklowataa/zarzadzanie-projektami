import { Task, TaskStatus } from "@/types/task";

export class LocalStorageTaskBackend {
    private static storageKey = "tasks";

    private static getRawTasks(): Task[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    private static saveTasks(tasks: Task[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    static async getAllByStory(storyId: string): Promise<Task[]> {
        const tasks = this.getRawTasks();
        return tasks.filter(t => t.storyId === storyId);
    }

    static async getById(taskId: string): Promise<Task | undefined> {
        const tasks = this.getRawTasks();
        return tasks.find(t => t.id === taskId);
    }

    static async create(task: Task): Promise<void> {
        const tasks = this.getRawTasks();
        const newTask: Task = {
            ...task,
            ownerId: task.ownerId,
            assignUserId: task.assignUserId ?? undefined,
            status: task.status ?? "todo",
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        this.saveTasks(tasks);
    }

    static async updateAssignment(taskId: string, userId: string): Promise<void> {
        const tasks = this.getRawTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = {
                ...tasks[index],
                assignUserId: userId,
                status: "in progress",
                dateStart: new Date().toISOString()
            };
            this.saveTasks(tasks);
        }
    }

    static async completeTask(taskId: string): Promise<void> {
        const tasks = this.getRawTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = {
                ...tasks[index],
                status: "done",
                dateEnd: new Date().toISOString()
            };
            this.saveTasks(tasks);
        }
    }

    static async updateStatus(taskId: string, status: TaskStatus): Promise<void> {
        const tasks = this.getRawTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], status };
            this.saveTasks(tasks);
        }
    }

    static async delete(taskId: string): Promise<void> {
        const tasks = this.getRawTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        this.saveTasks(filtered);
    }
}