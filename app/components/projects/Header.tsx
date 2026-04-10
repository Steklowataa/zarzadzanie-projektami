import Link from "next/link"
import MessageView from "../../components/messages/MessageView"
import { useNotifications } from "../../../app/context/NotificationContext"

export default function Header({userName}: {userName: string}) {
    const { unreadCount } = useNotifications()

    return (
        <header className="flex w-full items-end justify-end gap-x-2 bg-white/30 p-3">
            <div className="flex justify-center items-center text-[16px]">User: {userName}</div>
            <Link href="/messages" className="relative">
                <MessageView counter={unreadCount} visibility={unreadCount > 0}/>
            </Link>
             <Link href="/projects/create" className="bg-[#B9FF68] px-6 py-3 rounded-full text-black font-bold uppercase text-sm hover:scale-105 transition-transform">
                    + Create Project
                </Link>
        </header>
    )
}