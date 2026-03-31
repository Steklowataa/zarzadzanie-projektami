"use client"
import { ArrowLeft } from "lucide-react"

function BackBtn({title, router, projectId}: {title: string, router: any, projectId: string}) {
    return (
        <button 
          onClick={() => router.push(`/projects/${projectId}/stories`)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-4 uppercase text-[10px] tracking-[0.2em] font-bold">
            <ArrowLeft size={14} />
            {title}
          </button>
    )
}

export default BackBtn