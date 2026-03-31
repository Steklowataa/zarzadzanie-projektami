export const STORY_PRIORITIES = {
  low: {
    color: "#25B3FF", 
    label: "Low",
  },
  medium: {
    color: "#80CF23", 
    label: "Medium",
  },
  high: {
    color: "#FF4B4B", 
    label: "High",
  },
} as const;

export type PriorityLevel = keyof typeof STORY_PRIORITIES;