"use client"
import { ArrowLeft } from "lucide-react"

function BackBtn({title, onClick}: {title: string, onClick: () => void}) {
    return (
        <button 
          onClick={onClick}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition cursor-pointer mb-4 uppercase text-[10px] tracking-[0.2em] font-bold">
            <ArrowLeft size={14} />
            {title}
          </button>
    )
}

export default BackBtn