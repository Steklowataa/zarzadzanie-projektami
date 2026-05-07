"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { auth, db } from '@/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { NotificationService } from '@/lib/notificationService';
import { Message } from '@/types/messages';
import { usePathname, useRouter } from 'next/navigation';

// Typy
interface User { 
    id: string; 
    role: string; 
    name: string; 
}

interface NotificationContextType {
    notifications: Message[]; 
    unreadCount: number;
    user: User | null;
    loading: boolean;
    activeMessage: Message | null;
    setActiveMessage: (msg: Message | null) => void;
    markAsRead: (id: string) => void;
    addNotification: (msg: Omit<Message, 'id' | 'isRead' | 'date'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeMessage, setActiveMessage] = useState<Message | null>(null);

    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/login';

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const userSnap = await getDoc(doc(db, "users", fbUser.uid));

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUser({
                        id: fbUser.uid,
                        role: data.role || 'guest',
                        name: data.name || "Użytkownik"
                    });
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, []);


    useEffect(() => {
        if (loading) return;

        if (!user && !isLoginPage) {
            router.push('/login');
        }

        if (user && isLoginPage) {
            router.push('/projects');
        }

    }, [user, loading, pathname, router]);

    // 🔔 NOTIFICATIONS
    useEffect(() => {
        if (loading || !user || user.role === 'blocked') return;

        const unsubscribe = NotificationService.subscribeToUserNotifications(
            user.id,
            user.role,
            (newMessages) => {
                setMessages(newMessages);
            }
        );

        return () => unsubscribe();
    }, [user, loading]);

    const markAsRead = async (id: string) => {
        try {
            await NotificationService.markAsRead(id);
        } catch (error) {
            console.error("Błąd przy oznaczaniu powiadomienia:", error);
        }
    };

    const addNotification = useCallback(async (msg: Omit<Message, 'id' | 'isRead' | 'date'>) => {
        try {
            await NotificationService.create({
                ...msg,
                isRead: false,
                date: new Date().toISOString()
            });
        } catch (error) {
            console.error("Błąd przy dodawaniu powiadomienia:", error);
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifications: messages, 
            unreadCount: messages.filter(m => !m.isRead).length,
            user,
            loading,
            activeMessage,
            setActiveMessage,
            markAsRead,
            addNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}