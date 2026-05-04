"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Message } from '@/types/messages';
import { eventBus, APP_EVENTS } from '@/utils/eventBus';

interface NotificationContextType {
    notifications: Message[]; 
    addNotification: (msg: Omit<Message, 'id' | 'isRead' | 'date'>) => void;
    markAsRead: (id: string) => void;
    unreadCount: number;
    activeMessage: Message | null;
    setActiveMessage: (msg: Message | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeMessage, setActiveMessage] = useState<Message | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    useEffect(() => {
        const savedNotifications = localStorage.getItem('app_notifications');
        if (savedNotifications) {
            setMessages(JSON.parse(savedNotifications));
        }

        const role = sessionStorage.getItem('user_role');
        const id = sessionStorage.getItem('user_id'); 
        
        setCurrentUserId(id);
        setCurrentUserRole(role);
    }, []);


    useEffect(() => {
        if (messages.length > 0 || localStorage.getItem('app_notifications')) {
            localStorage.setItem('app_notifications', JSON.stringify(messages));
        }
    }, [messages]);


    const userNotifications = messages.filter(n => {
        if (!currentUserId || !currentUserRole) return false;


        const isDirectRecipient = n.recipientId === currentUserId;
        

        const isAdminNotification = 
            (n.recipientId === 'admin') && 
            (currentUserRole === 'admin' || currentUserRole === 'super-admin');

        return isDirectRecipient || isAdminNotification;
    });

    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    const addNotification = useCallback((msg: Omit<Message, 'id' | 'isRead' | 'date'>) => {
        const newMsg: Message = { 
            ...msg, 
            id: crypto.randomUUID(), 
            isRead: false, 
            date: new Date().toLocaleString() 
        };
        setMessages(prev => [newMsg, ...prev]);
    }, []);

    const markAsRead = (id: string) => {
        setMessages(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    useEffect(() => {

        const handleUserRegistered = (data: any) => {
            addNotification({
                title: "Nowy użytkownik w systemie",
                message: data.message,
                priority: 'high',
                recipientId: 'admin'
            });
        };


        const handleTaskAssigned = (data: { userId: string, taskName: string }) => {
            addNotification({
                title: "Nowe zadanie!",
                message: `Zostałeś przypisany do zadania: ${data.taskName}`,
                priority: 'high',
                recipientId: data.userId 
            });
        };


        const handleStatusChange = (data: { taskName: string, newStatus: string, ownerId: string }) => {
            addNotification({
                title: "Zmiana statusu",
                message: `Zadanie ${data.taskName} jest teraz: ${data.newStatus}`,
                priority: 'low',
                recipientId: data.ownerId
            });
        };

        eventBus.on(APP_EVENTS.USER_REGISTERED, handleUserRegistered);
        eventBus.on(APP_EVENTS.TASK_ASSIGNED, handleTaskAssigned);
        eventBus.on(APP_EVENTS.TASK_STATUS_CHANGED, handleStatusChange);

        // Opcjonalnie: Cleanup
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{ 
            notifications: userNotifications, 
            addNotification, 
            markAsRead, 
            unreadCount,
            activeMessage,
            setActiveMessage,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}