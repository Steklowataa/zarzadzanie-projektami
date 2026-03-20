import { Story } from "../types/story";

export class StoryService {
    private static STORAGE_KEY = "stories";

    static getAllByProject(projectId: string): Story[] {
        const stories: Story[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        return stories.filter(s => s.projectId === projectId);
    }

    static create(story: Story): void {
        const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
        stories.push(story);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }
    
    // todo delete edit
}