"use client"
import { Plus } from "lucide-react"

interface CreateButtonProps {
    title: string
    onClick: () => void;
}

function CreateButton({ title, onClick }: CreateButtonProps) {
    return (
        <button 
            onClick={onClick}
            className="bg-[#B9FF68] text-black px-6 py-3 rounded-full font-black text-xs uppercase
             hover:scale-105 transition flex items-center gap-2 shadow-[0_0_20px_rgba(185,255,104,0.3)] cursor-pointer">
            <Plus size={16} strokeWidth={3}/>
            {title}
        </button>
    )
}

export default CreateButton