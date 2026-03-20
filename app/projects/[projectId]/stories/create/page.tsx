"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid" 
import { Story } from "@/types/story"
import { StoryService } from "../../../../../lib/storyServices"

export default function CreateStoryPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.projectId as string

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
            ownerId: "1" 
        }

        StoryService.create(newStory)
        
        router.push(`/projects/${projectId}/stories`)
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6 text-white">Add New Story</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg border border-gray-800">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Story Name</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Implement Login logic"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500 h-32"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed task description..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Story["status"] })}
                        >
                            <option value="todo">Todo</option>
                            <option value="in progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none"
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
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Create Story
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}