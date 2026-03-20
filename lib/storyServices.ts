import { Story } from "../types/story";

export class StoryService {
    private static STORAGE_KEY = "stories";

    static getAllByProject(projectId: string): Story[] {
        const stories: Story[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        return stories.filter(s => s.projectId === projectId);
    }

    static getById(id: string): Story | undefined {
        const stories: Story[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        return stories.find(s => s.id === id);
    }


    static create(story: Story): void {
        const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        stories.push(story);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }

    static edit(updatedStory: Story): void {
        const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        const newStories = stories.map((story: Story) => {
            if (story.id === updatedStory.id) {
                return updatedStory;
            }
            return story;
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newStories));

    }

    static delete(storyId: string): void {
        const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        const newStories = stories.filter((story: Story) => story.id !== storyId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newStories));
    }
}