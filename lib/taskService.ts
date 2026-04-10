import { Task } from "../types/task";
import { StoryService } from "./storyServices";
import {APP_EVENTS, eventBus } from "@/utils/eventBus";

export class TaskService {
    private static STORAGE_KEY = "tasks";

    /**
     * POBIERANIE SUROWYCH DANYCH
     * Bezpieczna metoda wywoływana wewnętrznie
     */
    private static getRawTasks(): Task[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(this.STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Błąd parsowania localStorage:", e);
            return [];
        }
    }

    /**
     * ZAPISYWANIE DANYCH
     * Centralna metoda zapisu
     */
    private static _saveTasks(tasks: Task[]): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        }
    }


    static create(task: Task): void {
        const existingTasks = this.getRawTasks();
        const updatedTasks = [...existingTasks, task];
        this._saveTasks(updatedTasks);
        const story = StoryService.getById(task.storyId);
        
        if (story && story.ownerId) {
             eventBus.emit(APP_EVENTS.TASK_CREATED, { 
                    ownerId: story.ownerId,
                    taskName: task.name,
                    storyName: story.name,
                });
        }

        console.log("Zapisano! Aktualna liczba zadań w bazie:", updatedTasks.length);
    }

    /**
     * POBIERANIE ZADAŃ DLA HISTORYJKI
     */
    static getAllByStory(storyId: string): Task[] {
        const allTasks = this.getRawTasks();
        const filtered = allTasks.filter(t => t.storyId === storyId);
        console.log(`Znaleziono ${filtered.length} zadań dla story: ${storyId}`);
        return filtered;
    }

    /**
     * POBIERANIE JEDNEGO ZADANIA PO ID
     */
    static getById(taskId: string): Task | undefined {
        return this.getRawTasks().find(t => t.id === taskId);
    }

    /**
     * LOGIKA BIZNESOWA: PRZYPISANIE OSOBY
     * Automatycznie zmienia stan zadania i historyjki
     */
    static assignUser(taskId: string, userId: string): void {
        const tasks = this.getRawTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        
        if (index !== -1) {
            tasks[index].ownerId = userId;
            tasks[index].status = "in progress"; 
            tasks[index].dateStart = new Date().toISOString();
            
            this._saveTasks(tasks);

            eventBus.emit(APP_EVENTS.TASK_ASSIGNED, { 
                    userId: userId,
                    taskName: tasks[index].name,
                });

            const story = StoryService.getById(tasks[index].storyId);
            if (story && story.status === "todo") {
                story.status = "in progress";
                StoryService.edit(story);
            }
        }
    }

    /**
     * LOGIKA BIZNESOWA: ZAMKNIĘCIE ZADANIA
     * Sprawdza czy wszystkie zadania w historyjce są DONE
     */
    static completeTask(taskId: string): void {
        const tasks = this.getRawTasks();
        const index = tasks.findIndex(t => t.id === taskId);

        if (index !== -1) {
            tasks[index].status = "done";
            tasks[index].dateEnd = new Date().toISOString();
            this._saveTasks(tasks);

            // Sprawdzanie statusu historyjki
            const currentStoryId = tasks[index].storyId;
            const storyTasks = tasks.filter(t => t.storyId === currentStoryId);
            const allDone = storyTasks.every(t => t.status === "done");
            
            if (allDone) {
                const story = StoryService.getById(currentStoryId);
                if (story) {
                    story.status = "done";
                    StoryService.edit(story);
                }
            }
        }
    }

    /**
     * USUWANIE ZADANIA
     */
    static delete(taskId: string): void {
        const tasks = this.getRawTasks();
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        this._saveTasks(updatedTasks);
    }
}