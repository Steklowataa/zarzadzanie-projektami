"use client"
import { useNotifications } from "../context/NotificationContext";

export default function MessagesPage() {
    const { notifications, markAsRead, activeMessage, setActiveMessage } = useNotifications();

    return (
        <div className="flex h-[80vh] bg-black rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
                <div className="p-4 border-b font-bold text-lg">Powiadomienia</div>
                {notifications.map(msg => (
                    <div 
                        key={msg.id}
                        onClick={() => {
                            setActiveMessage(msg);
                            if(!msg.isRead) markAsRead(msg.id);
                        }}
                        className={`p-4 cursor-pointer border-b transition-colors ${
                            activeMessage?.id === msg.id ? 'bg-[#B1FF58]/10' : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {!msg.isRead && <div className="w-2 h-2 bg-[#B1FF58] rounded-full" />}
                            <span className={`text-sm ${!msg.isRead ? 'font-bold' : 'text-gray-500'}`}>{msg.title}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                    </div>
                ))}
            </div>

            <div className="w-2/3 p-8 flex flex-col">
                {activeMessage ? (
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-2xl font-bold">{activeMessage.title}</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100">
                                Priority: {activeMessage.priority}
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">{activeMessage.message}</p>
                        <p className="text-xs text-gray-400">Data otrzymania: {activeMessage.date}</p>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Wybierz wiadomość, aby przeczytać szczegóły
                    </div>
                )}
            </div>
        </div>
    );
}