import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { eventBus, APP_EVENTS } from "@/utils/eventBus";
import { Project } from "@/types/project"

export class NotificationAdapter {
    static init() {
        // 1. PROJECT_CREATED
        eventBus.on(APP_EVENTS.PROJECT_CREATED, async (project: Project) => {
            try {
                await addDoc(collection(db, "notifications"), {
                    title: "Utworzono nowy projekt",
                    message: `Projekt "${project.name}" został utworzony.`,
                    date: new Date().toISOString(),
                    priority: "high",
                    isRead: false,
                    recipientId: project.ownerId 
                });
            } catch (e) {
                console.error("Błąd wysyłania powiadomienia (PROJECT_CREATED):", e);
            }
        });

        // 2. TASK_ASSIGNED
        eventBus.on(APP_EVENTS.TASK_ASSIGNED, async (data: { taskName: string; assigneeId: string }) => {
            try {
                await addDoc(collection(db, "notifications"), {
                    title: "Przypisano zadanie",
                    message: `Zostałeś/aś przypisany/a do zadania: "${data.taskName}".`,
                    date: new Date().toISOString(),
                    priority: "medium",
                    isRead: false,
                    recipientId: data.assigneeId
                });
            } catch (e) {
                console.error("Błąd wysyłania powiadomienia (TASK_ASSIGNED):", e);
            }
        });

        // 3. TASK_CREATED
        eventBus.on(APP_EVENTS.TASK_CREATED, async (data: { taskName: string; recipientId: string }) => {
            try {
                await addDoc(collection(db, "notifications"), {
                    title: "Nowe zadanie",
                    message: `Utworzono nowe zadanie: "${data.taskName}".`,
                    date: new Date().toISOString(),
                    priority: "low",
                    isRead: false,
                    recipientId: data.recipientId
                });
            } catch (e) {
                console.error("Błąd wysyłania powiadomienia (TASK_CREATED):", e);
            }
        });

        // 4. TASK_DELETED
        eventBus.on(APP_EVENTS.TASK_DELETED, async (data: { taskName: string; recipientId: string }) => {
            try {
                await addDoc(collection(db, "notifications"), {
                    title: "Usunięto zadanie",
                    message: `Zadanie "${data.taskName}" zostało usunięte.`,
                    date: new Date().toISOString(),
                    priority: "low",
                    isRead: false,
                    recipientId: data.recipientId
                });
            } catch (e) {
                console.error("Błąd wysyłania powiadomienia (TASK_DELETED):", e);
            }
        });

        // 5. TASK_STATUS_CHANGED
        eventBus.on(APP_EVENTS.TASK_STATUS_CHANGED, async (data: { taskName: string; oldStatus: string; newStatus: string; recipientId: string }) => {
            try {
                await addDoc(collection(db, "notifications"), {
                    title: "Zmiana statusu zadania",
                    message: `Zadanie "${data.taskName}" zmieniło status z ${data.oldStatus} na ${data.newStatus}.`,
                    date: new Date().toISOString(),
                    priority: "medium",
                    isRead: false,
                    recipientId: data.recipientId
                });
            } catch (e) {
                console.error("Błąd wysyłania powiadomienia (TASK_STATUS_CHANGED):", e);
            }
        });

        // 6. STORY_TASK_MODIFIED
        eventBus.on(APP_EVENTS.STORY_TASK_MODIFIED, async (data: { storyName: string; recipientId: string }) => {
            try {
                await addDoc(collection(db, "notifications"), {
                    title: "Modyfikacja historyjki",
                    message: `Zadania w historyjce "${data.storyName}" zostały zmodyfikowane.`,
                    date: new Date().toISOString(),
                    priority: "medium",
                    isRead: false,
                    recipientId: data.recipientId
                });
            } catch (e) {
                console.error("Błąd wysyłania powiadomienia (STORY_TASK_MODIFIED):", e);
            }
        });


        eventBus.on(APP_EVENTS.USER_REGISTERED, async (data: { userName: string; userId: string }) => {
            try {
                await addDoc(collection(db, "notifications"), {
                    title: "Witamy w aplikacji!",
                    message: `Cześć ${data.userName}! Twoje konto zostało pomyślnie utworzone.`,
                    date: new Date().toISOString(),
                    priority: "high",
                    isRead: false,
                    recipientId: data.userId
                });
            } catch (e) {
                console.error("Błąd wysyłania powiadomienia (USER_REGISTERED):", e);
            }
        });
    }
}