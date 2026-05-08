import { db } from "../firebase";
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
import { Story } from "../types/story";

export class StoryService {
    private static collectionName = "stories";

    static async getAllByProject(projectId: string): Promise<Story[]> {
        try {
            const q = query(
                collection(db, this.collectionName), 
                where("projectId", "==", projectId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as Story));
        } catch (e) {
            console.error("Błąd pobierania stories:", e);
            return [];
        }
    }

    static async getById(id: string): Promise<Story | undefined> {
        if (!id) return undefined;
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return {
                    ...docSnap.data(),
                    id: docSnap.id
                } as Story;
            }
        } catch (e) {
            console.error("Błąd pobierania story by id:", e);
        }
        return undefined;
    }

    static async create(story: Story): Promise<void> {
        try {
            // Log do debugowania - sprawdź w konsoli co tu wpada
            console.log("Tworzenie story z właścicielem:", story.ownerId);
            
            if (!story.ownerId || story.ownerId === "1") {
                console.warn("Uwaga: Próba utworzenia story z niepoprawnym ownerId!");
            }

            await setDoc(doc(db, this.collectionName, story.id), story);
        } catch (e) {
            console.error("Błąd tworzenia story:", e);
            throw e;
        }
    }

    static async edit(updatedStory: Story): Promise<void> {
        try {
            const docRef = doc(db, this.collectionName, updatedStory.id);
            // Dodajemy ownerId do listy aktualizowanych pól
            await updateDoc(docRef, {
                name: updatedStory.name,
                description: updatedStory.description,
                status: updatedStory.status,
                priority: updatedStory.priority,
                ownerId: updatedStory.ownerId // Teraz zmiana właściciela zadziała
            });
        } catch (e) {
            console.error("Błąd edycji story:", e);
            throw e;
        }
    }

    static async delete(storyId: string): Promise<void> {
        if (!storyId) return;
        try {
            await deleteDoc(doc(db, this.collectionName, storyId));
        } catch (e) {
            console.error("Błąd usuwania story:", e);
            throw e;
        }
    }
}