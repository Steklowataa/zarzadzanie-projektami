import { Task } from "../types/task";
import { StoryService } from "./storyServices";
import { db } from "@/firebase";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc, query, where,addDoc} from "firebase/firestore";

export class TaskService {
  private static collectionName = "tasks";
  static async getAllByStory(storyId: string): Promise<Task[]> {
    const q = query(
      collection(db, this.collectionName),
      where("storyId", "==", storyId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(d => {
      const data = d.data() as Task;

      return {
        ...data,
        id: d.id
      };
    });
  }

 
  static async getById(taskId: string) {
    const snap = await getDoc(doc(db, this.collectionName, taskId));
    if (!snap.exists()) return undefined;

    return {
      id: snap.id,
      ...(snap.data() as Task)
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

    const story = await StoryService.getById(task.storyId);
    if (story && story.status === "todo") {
      await StoryService.edit({ ...story, status: "in progress" });
    }
  }

  static async assignUser(taskId: string, userId: string): Promise<void> {
    const taskRef = doc(db, this.collectionName, taskId);

    await updateDoc(taskRef, {
      assignUserId: userId,
      status: "in progress",
      dateStart: new Date().toISOString()
    });
    

    const task = await this.getById(taskId);
    if (!task) return;

    const story = await StoryService.getById(task.storyId);
    if(story && story.status !== "in progress") {
      await StoryService.edit({ ...story, status: "in progress" });
    }

    if (story?.ownerId) {
      await addDoc(collection(db, "notifications"), {
        title: "User assigned",
        message: `${userId} assigned to ${task.name}`,
        dateStart: new Date().toISOString(),
        recipientId: userId,
        priority: "high",
        isRead: false
      });
    }
  }


  static async completeTask(taskId: string): Promise<void> {
    const taskRef = doc(db, this.collectionName, taskId);

    await updateDoc(taskRef, {
      status: "done",
      dateEnd: new Date().toISOString()
    });

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
  }

  static async delete(taskId: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, taskId));
  }
}