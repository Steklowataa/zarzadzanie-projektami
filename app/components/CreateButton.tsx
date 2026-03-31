"use client"
import { Plus } from "lucide-react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface CreateButtonProps {
    title: string
    router: AppRouterInstance
    projectId: string
    storyId: string
}

function CreateButton({ title, router, projectId, storyId }: CreateButtonProps) {
    return (
        <button 
            onClick={() => router.push(`/projects/${projectId}/stories/${storyId}/tasks/create`)}
            className="bg-[#B9FF68] text-black px-6 py-3 rounded-full font-black text-xs uppercase
             hover:scale-105 transition flex items-center gap-2 shadow-[0_0_20px_rgba(185,255,104,0.3)] cursor-pointer"
        >
            <Plus size={16} strokeWidth={3}/>
            {title}
        </button>
    )
}

export default CreateButton