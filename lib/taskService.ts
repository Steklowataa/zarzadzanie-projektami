import { Task } from "../types/task";
import { StoryService } from "./storyServices";
import { db } from "@/firebase";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc, query, where, addDoc } from "firebase/firestore";

export class TaskService {
    private static collectionName = "tasks";

    static async getAllByStory(storyId: string): Promise<Task[]> {
        try {
            const q = query(
                collection(db, this.collectionName), 
                where("storyId", "==", storyId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as Task));
        } catch (e) {
            console.error("Błąd pobierania tasks:", e);
            return [];
        }
    }

    static async getById(taskId: string): Promise<Task | undefined> {
        if (!taskId) return undefined;
        const docRef = doc(db, this.collectionName, taskId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? {
            ...docSnap.data(),
            id: docSnap.id
        } as Task : undefined;
    }

    static async create(task: Task): Promise<void> {
        try {
            await setDoc(doc(db, this.collectionName, task.id), task);
            const story = await StoryService.getById(task.storyId);
            
            if (story?.ownerId) {
                await addDoc(collection(db, "notifications"), {
                    title: "Utworzono nowe zadanie w historyjce",
                    message: `Zadanie ${task.name} zostało utworzone.`,
                    date: new Date().toISOString(),
                    priority: "medium",
                    isRead: false,
                    recipientId: story.ownerId 
                });
            }
        } catch (e) {
            console.error("Błąd zapisu w Firebase:", e);
        }
    }

    static async assignUser(taskId: string, userId: string): Promise<void> {
        try {
            const task = await this.getById(taskId);
            if (!task) return;

            const taskRef = doc(db, this.collectionName, taskId);
            await updateDoc(taskRef, {
                ownerId: userId,
                status: "in progress" as const,
                dateStart: new Date().toISOString()
            });

            await addDoc(collection(db, "notifications"), {
                title: "Przypisano uzytkownika do zadania",
                message: `Uzytkownik ${userId} został przypisany do zadania ${task.name}.`,
                date: new Date().toISOString(),
                priority: "high",
                isRead: false,
                recipientId: userId
            });

            const story = await StoryService.getById(task.storyId);
            if (story) {
                if (story.ownerId) {
                    await this.sendStatusNotification(task.name, task.storyId, "in progress");
                }
                if (story.status === "todo") {
                    await StoryService.edit({ ...story, status: "in progress" });
                }
            }
        } catch (e) {
            console.error("Błąd assignUser:", e);
        }
    }

    static async completeTask(taskId: string): Promise<void> {
        try {
            const task = await this.getById(taskId);
            if (!task) return;

            const taskRef = doc(db, this.collectionName, taskId);
            await updateDoc(taskRef, {
                status: "done" as const,
                dateEnd: new Date().toISOString()
            });
            
            await this.sendStatusNotification(task.name, task.storyId, "done");

            const storyTasks = await this.getAllByStory(task.storyId);
            const allDone = storyTasks.every(t => t.status === "done");

            if (allDone) {
                const story = await StoryService.getById(task.storyId);
                if (story && story.status !== "done") {
                    await StoryService.edit({ ...story, status: "done" });
                }
            }
        } catch (e) {
            console.error("Błąd completeTask:", e);
        }
    }

    static async delete(taskId: string): Promise<void> {
        if (!taskId) return;
        try {
            const task = await this.getById(taskId);
            if (!task) return;
            const story = await StoryService.getById(task.storyId);

            await deleteDoc(doc(db, this.collectionName, taskId));
            
            if (story?.ownerId) {
                await addDoc(collection(db, "notifications"), {
                    title: "Usunieto zadanie z historyjki",
                    message: `Zadanie ${task.name} zostało usunięte.`,
                    date: new Date().toISOString(),
                    priority: "high",
                    isRead: false,
                    recipientId: story.ownerId
                });
            }
        } catch (e) {
            console.error("Błąd podczas usuwania taski:", e);
            throw e;
        }
    }

    private static async sendStatusNotification(taskName: string, storyId: string, newStatus: string) {
        try {
            const story = await StoryService.getById(storyId);
            if (!story?.ownerId) return;

            let priorityS: "medium" | "low" | "high" = "low";
            if (newStatus === "in progress") {
                priorityS = "low";
            } else if (newStatus === "done") {
                priorityS = "medium";
            }

            await addDoc(collection(db, "notifications"), {
                title: "Zmiana statusu zadania",
                message: `Zadanie "${taskName}" zmieniło status na: ${newStatus.toUpperCase()}.`,
                date: new Date().toISOString(),
                priority: priorityS,
                isRead: false,
                recipientId: story.ownerId
            });
        } catch (e) {
            console.error("Błąd wysyłania powiadomienia o statusie:", e);
        }
    }
}