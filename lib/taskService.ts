import { Task } from "../types/task";
import { StoryService } from "./storyServices";
import {APP_EVENTS, eventBus } from "@/utils/eventBus";
import { db } from "@/firebase";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";

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

            if (story && story.ownerId) {
               eventBus.emit(APP_EVENTS.TASK_CREATED, {
                    userId: story.ownerId,
                    storyName: story.name,
                    taskName: task.name
                });
            }
        } catch (e) {
            console.error("Błąd zapisu w Firebase:", e);
        }
    
        }

        static async assignUser(taskId: string, userId: string): Promise<void> {
        const task = await this.getById(taskId);
        if (!task) return;

        const taskRef = doc(db, this.collectionName, taskId);
        const updateData = {
            ownerId: userId,
            status: "in progress" as const,
            dateStart: new Date().toISOString()
        };

        await updateDoc(taskRef, updateData);

        eventBus.emit(APP_EVENTS.TASK_ASSIGNED, { 
            userId: userId,
            taskName: task.name,
        });

        const story = await StoryService.getById(task.storyId);
        if (story && story.status === "todo") {
            await StoryService.edit({ ...story, status: "in progress" });
        }
    }

    static async completeTask(taskId: string): Promise<void> {
        const task = await this.getById(taskId);
        if (!task) return;

        const taskRef = doc(db, this.collectionName, taskId);
        await updateDoc(taskRef, {
            status: "done" as const,
            dateEnd: new Date().toISOString()
        });

        const storyTasks = await this.getAllByStory(task.storyId);
        const allDone = storyTasks.every(t => t.status === "done");
        
        if (allDone) {
            const story = await StoryService.getById(task.storyId);
            if (story && story.status !== "done") {
                await StoryService.edit({ ...story, status: "done" });
            }
        }
    }


    static async delete(taskId: string): Promise<void> {
        if (!taskId) return;
        await deleteDoc(doc(db, this.collectionName, taskId));
    }
}