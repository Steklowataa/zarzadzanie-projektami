import { Story } from "@/types/story";

export class LocalStorageStoryBackend {
    private static storageKey = "stories";
    private static getRawStories(): Story[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    private static saveStories(stories: Story[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(stories));
    }

    static async getAllByProject(projectId: string): Promise<Story[]> {
        try {
            const stories = this.getRawStories();
            return stories.filter(story => story.projectId === projectId);
        } catch (e) {
            console.error("Błąd pobierania stories z LocalStorage:", e);
            return [];
        }
    }

    static async getById(id: string): Promise<Story | undefined> {
        if (!id) return undefined;
        try {
            const stories = this.getRawStories();
            return stories.find(story => story.id === id);
        } catch (e) {
            console.error("Błąd pobierania story by id z LocalStorage:", e);
        }
        return undefined;
    }

    static async create(story: Story): Promise<void> {
        try {
            console.log("Tworzenie story w LocalStorage z właścicielem:", story.ownerId);
            
            if (!story.ownerId || story.ownerId === "1") {
                console.warn("Uwaga: Próba utworzenia story z niepoprawnym ownerId!");
            }

            const stories = this.getRawStories();
            stories.push(story);
            this.saveStories(stories);
        } catch (e) {
            console.error("Błąd tworzenia story w LocalStorage:", e);
            throw e;
        }
    }

    static async update(updatedStory: Story): Promise<void> {
        try {
            const stories = this.getRawStories();
            const index = stories.findIndex(story => story.id === updatedStory.id);
            
            if (index !== -1) {
                stories[index] = {
                    ...stories[index],
                    name: updatedStory.name,
                    description: updatedStory.description,
                    status: updatedStory.status,
                    priority: updatedStory.priority,
                    ownerId: updatedStory.ownerId
                };
                this.saveStories(stories);
            } else {
                throw new Error(`Nie znaleziono story o id: ${updatedStory.id}`);
            }
        } catch (e) {
            console.error("Błąd edycji story w LocalStorage:", e);
            throw e;
        }
    }

    static async delete(storyId: string): Promise<void> {
        if (!storyId) return;
        try {
            const stories = this.getRawStories();
            const filteredStories = stories.filter(story => story.id !== storyId);
            this.saveStories(filteredStories);
        } catch (e) {
            console.error("Błąd usuwania story z LocalStorage:", e);
            throw e;
        }
    }
}