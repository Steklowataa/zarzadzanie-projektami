"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message } from '@/types/messages';
import { currentUser } from "../../types/mockUpUsers"
import { eventBus,  } from '@/utils/eventBus';


interface NotificationContextType {
    notifications: Message[]; 
    addNotification: (msg: Omit<Message, 'id' | 'isRead' | 'date'>) => void;
    markAsRead: (id: string) => void;
    unreadCount: number;
    activeMessage: Message | null;
    setActiveMessage: (msg: Message | null) => void;
}

const MOCK_DATA: Message[] = [
    {
        id: "1",
        title: "Nowy projekt",
        message: "Admin utworzył nowy projekt: 'Księżycowa Misja'.",
        date: "2026-04-10 12:00",
        priority: 'high',
        isRead: false,
        recipientId: "1"
    },
    {
        id: "2",
        title: "Zadanie przypisane",
        message: "Zostałeś przypisany do zadania: 'Naprawa silnika'.",
        date: "2026-04-10 14:30",
        priority: 'medium',
        isRead: false,
        recipientId: "2"
    }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>(MOCK_DATA);
    const [activeMessage, setActiveMessage] = useState<Message | null>(null);
    const [toast, setToast] = useState<Message | null>(null);


    const userNotifications = messages.filter(n => {
        const isDirectRecipient = n.recipientId === currentUser.id;
        const isAdminNotification = n.recipientId === 'admin' && currentUser.role === 'admin';
        return isDirectRecipient || isAdminNotification;
    });

    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    const viewMessage = (msg: Message) => {
        setActiveMessage(msg);
        if (!msg.isRead) {
            markAsRead(msg.id);
        }
    };


    const addNotification = (msg: Omit<Message, 'id' | 'isRead' | 'date'>) => {
    const newMsg = { ...msg, id: crypto.randomUUID(), isRead: false, date: new Date().toLocaleString() };
    setMessages(prev => [newMsg, ...prev]);


    if (msg.priority === 'high' || msg.priority === 'medium') {
        setToast(newMsg);
        setTimeout(() => setToast(null), 5000);
    }
};

    const markAsRead = (id: string) => {
        setMessages(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    useEffect(() => {

    const handleTaskAssigned = (data: { userId: string, taskName: string }) => {
            addNotification({
                title: "Nowe zadanie!",
                message: `Zostałeś przypisany do zadania: ${data.taskName}`,
                priority: 'high', // Zgodnie z zadaniem: przypisanie = high
                recipientId: data.userId
            });
        };
    eventBus.on('TASK_ASSIGNED', handleTaskAssigned);



    // Reakcja na zmianę statusu
    eventBus.on('TASK_STATUS_CHANGED', (data) => {
        const priority = data.newStatus === 'done' ? 'medium' : 'low';
        addNotification({
            title: "Zmiana statusu",
            message: `Zadanie ${data.taskName} zmieniło status na ${data.newStatus}`,
            priority: priority,
            recipientId: data.ownerId
        });
    });

    //reackaj na stworzenie nowego zadania
    const handleTaskCreated = (data: { ownerId: string, taskName: string, storyName: string }) => {
        addNotification({
            title: "Nowe zadanie w historyjce",
            message: `Do Twojej historyjki "${data.storyName}" dodano nowe zadanie: ${data.taskName}`,
            priority: 'medium',
            recipientId: data.ownerId 
        });
    };
    eventBus.on('TASK_CREATED', handleTaskCreated);

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