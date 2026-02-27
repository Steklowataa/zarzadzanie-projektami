"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Project } from "../../types/project"

export default function ProjectPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("projects") || "[]")
        }
        return []
    })

    const deleteProject = (id: string) => {
        const update = projects.filter(project => project.id !== id)
        setProjects(update)
        localStorage.setItem("projects", JSON.stringify(update))
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <Link href="/projects/create" className="bg-white pl-3 pr-3 pt-3 pb-3 rounded-full text-black cursor-pointer">Create Project</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {projects.map(project => (
                    <div className="border-white border-2 rounded-md p-4" key={project.id}>
                        <h2 className="text-xl font-semibold">{project.name}</h2>
                        <p className="text-gray-400 my-2">{project.description}</p>
                        
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => deleteProject(project.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                            <button onClick={() => router.push(`/projects/${project.id}/edit`)} className="text-blue-600 hover:underline cursor-pointer">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
            
            {projects.length === 0 && <p className="mt-4 text-gray-500">No projects found.</p>}
        </div>
    )
}