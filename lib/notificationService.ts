import { db } from "@/firebase";
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    doc, 
    orderBy,
    Timestamp 
} from "firebase/firestore";
import { Message } from "@/types/messages";

export class NotificationService {
    private static collectionName = "notifications";
    static async create(notification: Omit<Message, 'id'>): Promise<void> {
        try {
            await addDoc(collection(db, this.collectionName), {
                ...notification,
                date: new Date().toISOString()
            });
        } catch (e) {
            console.error("Błąd tworzenia powiadomienia:", e);
        }
    }


    static async markAsRead(notificationId: string): Promise<void> {
        const docRef = doc(db, this.collectionName, notificationId);
        await updateDoc(docRef, { isRead: true });
    }

    static subscribeToUserNotifications(
        userId: string, 
        role: string, 
        callback: (notifications: Message[]) => void
    ) {
        const notificationsRef = collection(db, this.collectionName);
        
        const recipientIds = [userId];
        if (role === 'admin' || role === 'super-admin') {
            recipientIds.push('admin');
        }
        console.log("Subs dla: ", {userId, role, recipientIds})
        const q = query(
            notificationsRef,
            where("recipientId", "in", recipientIds),
            // orderBy("date", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const notifications = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as Message));
            callback(notifications);
        });
    }
}