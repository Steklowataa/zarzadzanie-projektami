import { db } from "../../firebase";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { Project } from "../../types/project";

export class FirebaseProjectBackend {
    private static collectionName = "projects";

    static async getAll(): Promise<Project[]> {
        const querySnapshot = await getDocs(collection(db, this.collectionName));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project));
    }

    static async getById(id: string): Promise<Project | undefined> {
        if (!id) return undefined;
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id } as Project;
        }
        return undefined;
    }

    static async create(project: Project): Promise<void> {
        await setDoc(doc(db, this.collectionName, project.id), project);
    }

    static async update(updatedProject: Project): Promise<void> {
        const docRef = doc(db, this.collectionName, updatedProject.id);
        await updateDoc(docRef, {
            name: updatedProject.name,
            description: updatedProject.description,
            ownerId: updatedProject.ownerId
        });
    }

    static async delete(id: string): Promise<void> {
        const storiesQuery = query(collection(db, "stories"), where("projectId", "==", id));
        const storiesSnap = await getDocs(storiesQuery);
        for (const storyDoc of storiesSnap.docs) {
            const tasksQuery = query(collection(db, "tasks"), where("storyId", "==", storyDoc.id));
            const tasksSnap = await getDocs(tasksQuery);
            const taskPromises = tasksSnap.docs.map(t => deleteDoc(doc(db, "tasks", t.id)));
            await Promise.all(taskPromises);
            await deleteDoc(doc(db, "stories", storyDoc.id));
        }
        await deleteDoc(doc(db, this.collectionName, id));
    }
}