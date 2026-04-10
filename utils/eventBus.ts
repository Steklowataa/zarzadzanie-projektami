export const APP_EVENTS = {
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    TASK_CREATED: 'TASK_CREATED',
    TASK_DELETED: 'TASK_DELETED',
    TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED',
    STORY_TASK_MODIFIED: 'STORY_TASK_MODIFIED'
} as const;

export const eventBus = {
  on(event: string, callback: (data: any) => void) {
    document.addEventListener(event, (e) => callback((e as CustomEvent).detail));
  },
  emit(event: string, data: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
};