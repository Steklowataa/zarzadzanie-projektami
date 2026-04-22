'use client';

import Link from "next/link"
import MessageView from "../../components/messages/MessageView"
import { useNotifications } from "../../../app/context/NotificationContext"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Header() {
    const { unreadCount } = useNotifications()
    const pathname = usePathname()
    const [role, setRole] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)

    useEffect(() => {
        const currentUser = sessionStorage.getItem('user_role')
        setRole(currentUser)
        const currentName = sessionStorage.getItem('user_name')
        setName(currentName)
    }, [])

    const canSeeUser = role === "super-admin" || role === "admin"

    return (
        <header className="flex w-full items-center justify-end gap-x-6 bg-white/30 p-3 backdrop-blur-sm">
            {/* Sekcja wiadomości i nazwy użytkownika w jednej linii */}
            <Link href="/messages" className="flex items-center gap-x-3 hover:opacity-80 transition-opacity">
                <div className="relative">
                    <MessageView counter={unreadCount} visibility={unreadCount > 0}/>
                </div>
                <span className="text-white font-medium whitespace-nowrap">
                    {name || role || "Użytkownik"}
                </span>
            </Link>

            <div className="flex items-center gap-x-4">
                {canSeeUser && (
                    <Link 
                        href="/users" 
                        className={`text-sm transition-colors hover:text-blue-400 ${pathname === '/users' ? 'text-blue-400 font-bold' : 'text-white'}`}
                    >
                        Użytkownicy
                    </Link>
                )}

                <Link 
                    href="/projects/create" 
                    className="bg-[#B9FF68] px-6 py-2 rounded-full text-black font-bold uppercase text-xs hover:scale-105 transition-transform"
                >
                     + Create Project
                </Link>

                <button 
                    onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
                    className="text-xs uppercase tracking-wider text-red-500 hover:text-red-400 font-bold border border-red-500/20 px-3 py-2 rounded-lg transition-colors"
                >
                    Wyloguj
                </button>
            </div>
        </header>
    )
}