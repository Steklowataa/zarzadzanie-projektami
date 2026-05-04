import { db } from "@/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { DB_CONFIG } from "@/settings";
import { User } from "@/settings";

export class UserService {
    static async getUser(userId: string): Promise<User | null> {
        if (DB_CONFIG === 'firebase') {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as User;
            }
            return null;
        } else {
            const users = JSON.parse(localStorage.getItem('app_users') || '[]');
            return users.find((u: User) => u.id === userId) || null;
        }
    }

    static async saveUser(user: User): Promise<void> {
        if (DB_CONFIG === 'firebase') {
            await setDoc(doc(db, "users", user.id), {
                name: user.name,
                email: user.email,
                role: user.role,
                updatedAt: serverTimestamp()
            }, { merge: true }); 
        } else {
            const users = JSON.parse(localStorage.getItem('app_users') || '[]');
            const index = users.findIndex((u: User) => u.id === user.id);
            if (index !== -1) {
                users[index] = user;
            } else {
                users.push(user);
            }
            localStorage.setItem('app_users', JSON.stringify(users));
        }
    }
}