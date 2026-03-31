export interface Task {
      id: string,
      name: string,
      description: string,
      status: "todo" | "in progress" | "done",
      priority: "low" | "medium" | "high",
      timeofWork: string,
      projectId: string,
      storyId: string,
      createdAt: string,
      ownerId: string,
      dateStart: string,
      dateEnd: string
}