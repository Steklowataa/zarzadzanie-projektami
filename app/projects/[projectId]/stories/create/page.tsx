"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid" 
import { Story } from "@/types/story"
import { StoryService } from "@/lib/storyServices"
import { User } from "@/types/user" 

export default function CreateStoryPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.projectId as string

    const mockUser: User = {
        id: "1",
        name: "John",
        email: "test@gmail.com"
    }

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "todo" as Story["status"],
        priority: "low" as Story["priority"],
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newStory: Story = {
            id: uuidv4(),
            ...formData,
            projectId: projectId, 
            createdAt: new Date().toISOString(),
            ownerId: mockUser.id 
        }

        StoryService.create(newStory)
        router.push(`/projects/${projectId}/stories`)
    }

    return (
        <div className="max-w-2xl mx-auto p-8 text-white">
            {/* Informacja o autorze (opcjonalnie, dla debugowania) */}
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                Creating as: <span className="text-[#B9FF68]">{mockUser.name}</span>
            </p>
            
            <h1 className="text-3xl font-black italic mb-8 tracking-tighter">ADD_NEW_STORY</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a1a]/80 backdrop-blur-xl p-8 rounded-[30px] border border-white/10 shadow-xl">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Story Name</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#B9FF68] transition"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Implement Login logic"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Description</label>
                    <textarea
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#B9FF68] transition h-32 resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed task description..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Status</label>
                        <select
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Story["status"] })}
                        >
                            <option value="todo">Todo</option>
                            <option value="in progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Priority</label>
                        <select
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Story["priority"] })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        type="submit"
                        className="flex-1 bg-[#B9FF68] hover:scale-[1.02] text-black font-black py-4 rounded-full transition uppercase text-sm shadow-lg shadow-[#B9FF68]/10"
                    >
                        Create Story
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-full transition uppercase text-xs tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}