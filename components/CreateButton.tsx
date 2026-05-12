"use client"
import { Plus, Loader2 } from "lucide-react"
import { useState } from "react"

interface CreateButtonProps {
    title: string
    onClick: () => void;
}

function CreateButton({ title, onClick }: CreateButtonProps) {
    const [isPending, setIsPending] = useState(false);

    const handleClick = () => {
        setIsPending(true);
        onClick();
        setTimeout(() => setIsPending(false), 2000);
    };

    return (
        <button 
            onClick={handleClick}
            disabled={isPending}
            className={`
                bg-[#B9FF68] text-black px-6 py-3 rounded-full font-black text-xs
                hover:scale-105 transition flex items-center gap-2 shadow-[0_0_20px_rgba(185,255,104,0.3)] 
                cursor-pointer active:scale-95 disabled:opacity-70 disabled:cursor-wait
            `}>
            {isPending ? (
                <Loader2 size={16} strokeWidth={3} className="animate-spin" />
            ) : (
                <Plus size={16} strokeWidth={3}/>
            )}
            {isPending ? "Loading..." : title}
        </button>
    )
}

export default CreateButton