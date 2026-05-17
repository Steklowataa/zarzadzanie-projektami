import { db } from "@/firebase";
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    setDoc, 
    deleteDoc, 
    updateDoc, 
    query, 
    where 
} from "firebase/firestore";
import { Task } from "@/types/task";

export class FirebaseTaskBackend {
    private static collectionName = "tasks";

    static async getAllByStory(storyId: string): Promise<Task[]> {
        const q = query(
            collection(db, this.collectionName),
            where("storyId", "==", storyId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({
            ...(d.data() as Task),
            id: d.id
        }));
    }

    static async getById(taskId: string): Promise<Task | undefined> {
        const snap = await getDoc(doc(db, this.collectionName, taskId));
        if (!snap.exists()) return undefined;
        return {
            ...(snap.data() as Task),
            id: snap.id,
        };
    }

    static async create(task: Task): Promise<void> {
        const taskRef = doc(db, this.collectionName, task.id);
        await setDoc(taskRef, {
            ...task,
            ownerId: task.ownerId,
            assignUserId: task.assignUserId ?? null,
            status: task.status ?? "todo",
            dateCreated: new Date().toISOString()
        });
    }

    static async updateAssignment(taskId: string, userId: string): Promise<void> {
        const taskRef = doc(db, this.collectionName, taskId);
        await updateDoc(taskRef, {
            assignUserId: userId,
            status: "in progress",
            dateStart: new Date().toISOString()
        });
    }

    static async completeTask(taskId: string): Promise<void> {
        const taskRef = doc(db, this.collectionName, taskId);
        await updateDoc(taskRef, {
            status: "done",
            dateEnd: new Date().toISOString()
        });
    }

    static async updateStatus(taskId: string, status: string): Promise<void> {
        const taskRef = doc(db, this.collectionName, taskId);
        await updateDoc(taskRef, { status });
    }

    static async delete(taskId: string): Promise<void> {
        await deleteDoc(doc(db, this.collectionName, taskId));
    }
}