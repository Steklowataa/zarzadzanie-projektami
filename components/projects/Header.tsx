'use client';

import Link from "next/link"
import MessageView from "../messages/MessageView"
import { useNotifications } from "../../app/context/NotificationContext"
import { usePathname } from "next/navigation"
import { auth } from "@/firebase";

export default function Header() {
    const { unreadCount, user } = useNotifications()
    const pathname = usePathname()
    
    const canSeeUser = user?.role === 'admin' || user?.role === 'super-admin'

    const handleLogout = async () => {
        await auth.signOut();
        sessionStorage.clear();
        window.location.href = '/login/admin';
    }

    return (
        <header className="flex items-center mx-[30px] justify-end gap-x-6 border-white/30 border-2 border-dotted bg-white/10 p-3 backdrop-blur-sm rounded-2xl mt-2">
            <Link href="/messages" className="flex items-center gap-x-3 hover:opacity-80 transition-opacity">
                <div className="relative">
                    <MessageView counter={unreadCount} visibility={unreadCount > 0}/>
                </div>
                <span className="text-white font-medium whitespace-nowrap">
                    {user?.name || "Ładowanie..."}
                </span>
            </Link>

            <div className="flex items-center gap-x-4">
                {canSeeUser && (
                    <Link href="/users" className={`text-[16px] transition-colors hover:text-blue-400 ${pathname === '/users' ? 'text-blue-400 font-bold' : 'text-white'}`}>
                        Użytkownicy
                    </Link>
                )}
                <Link href="/projects/create" className="bg-[#B9FF68] px-6 py-2 rounded-full text-black font-bold uppercase text-xs hover:scale-105 transition-transform">
                     + Create Project
                </Link>
                <button 
                    onClick={handleLogout}
                    className="text-xs uppercase hover:scale-105 text-red-400 font-bold border border-red-500/20 bg-red-500/40 px-3 py-2 rounded-[20px] ">
                    Wyloguj
                </button>
            </div>
        </header>
    )
}