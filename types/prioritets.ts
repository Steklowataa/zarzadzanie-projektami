export const STORY_PRIORITIES = {
  low: {
    color: "#25B3FF", // Niebieski
    label: "Low",
  },
  medium: {
    color: "#80CF23", // Soczysta zieleń
    label: "Medium",
  },
  high: {
    color: "#FF4B4B", // Proponowany czerwony dla wysokiego (możesz zmienić)
    label: "High",
  },
} as const;

export type PriorityLevel = keyof typeof STORY_PRIORITIES;