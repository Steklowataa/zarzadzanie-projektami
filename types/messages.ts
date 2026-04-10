export interface Message {
    id: string,
    title: string,
    message: string,
    date: string,
    priority: 'low'|'medium'|'high',
    isRead: boolean,
    recipientId: string
}