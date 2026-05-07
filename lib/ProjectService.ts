import { db } from "../firebase";
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    setDoc, 
    deleteDoc, 
    updateDoc, addDoc 
} from "firebase/firestore";
import { Project } from "../types/project";
import { eventBus, APP_EVENTS } from "@/utils/eventBus";


export class ProjectService {
    private static collectionName = "projects";
    static async getAll(): Promise<Project[]> {
        const querySnapshot = await getDocs(collection(db, this.collectionName));
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        } as Project));
    }
    static async getById(id: string): Promise<Project | undefined> {
        if (!id) return undefined;
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                ...docSnap.data(),
                id: docSnap.id
            } as Project;
        }
        return undefined;
    }

    static async create(project: Project): Promise<void> {
        try {
            await setDoc(doc(db, this.collectionName, project.id), project);

            await addDoc(collection(db, "notifications"), {
                title: "Utworzono nowy projekt",
                message: `Projekt ${project.name} został utworzony.`,
                date: new Date().toISOString(),
                priority: "high",
                isRead: false,
                recipientId: 'admin'
            })
            console.log("Project zostaw utworzony i musi byc wyslalna wiadomosc")
        } catch (e) {
            console.error("Błąd zapisu w Firebase:", e);
        }
    }

    static async update(updatedProject: Project): Promise<void> {
        try {
            console.log(updatedProject.id)

            const docRef = doc(db, this.collectionName, updatedProject.id);
            await updateDoc(docRef, {
                name: updatedProject.name,
                description: updatedProject.description,
                ownerId: updatedProject.ownerId
            });
        } catch (e) {
            console.error("Błąd edycji w Firebase:", e);
            throw e
                
        }
    }

    static async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, this.collectionName, id));
    }
}