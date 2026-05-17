export const APP_EVENTS = {
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    TASK_CREATED: 'TASK_CREATED',
    TASK_DELETED: 'TASK_DELETED',
    TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED',
    STORY_TASK_MODIFIED: 'STORY_TASK_MODIFIED',
    USER_REGISTERED: 'USER_REGISTERED',
    PROJECT_CREATED: "PROJECT_CREATED"
} as const;

export const eventBus = {
  on(event: string, callback: (data: any) => void) {
    console.log(`[EventBus] Zarejestrowano nasłuchiwanie na: ${event}`);
    document.addEventListener(event, (e) => {
      console.log(`[EventBus] Sukces! Odebrano zdarzenie: ${event}`, (e as CustomEvent).detail);
      callback((e as CustomEvent).detail);
    });
  },
  emit(event: string, data: any) {
    console.log(`[EventBus] Nadawanie zdarzenia: ${event} z danymi:`, data);
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
};