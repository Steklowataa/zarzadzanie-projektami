"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Project } from "../../types/project"
import { useActiveProject } from "../../lib/useActiveProject"
import { currentUser } from "../../types/mockUpUsers"
import ProjectFilter from "../components/projects/ProjectFilter"

export default function ProjectPage() {
    const router = useRouter()
    const [showAll, setShowAll] = useState(false) 
    
    const [projects, setProjects] = useState<Project[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("projects") || "[]")
        }
        return []
    })

    const { activeProjectId } = useActiveProject()

    const deleteProject = (id: string) => {
        const update = projects.filter(project => project.id !== id)
        setProjects(update)
        localStorage.setItem("projects", JSON.stringify(update))
    }

    const displayedProjects = showAll 
        ? projects 
        : projects.filter(p => p.id === activeProjectId)

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Projects</h1>
                    <p className="text-gray-500 text-sm">User: {currentUser.name}</p>
                </div>
                <Link href="/projects/create" className="bg-[#B9FF68] px-6 py-3 rounded-full text-black font-bold uppercase text-sm hover:scale-105 transition-transform">
                    + Create Project
                </Link>
            </div>

            <ProjectFilter showAll={showAll} setShowAll={setShowAll} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProjects.map(project => (
                    <div 
                        key={project.id}
                        className={`p-6 rounded-3xl border transition-all ${project.id === activeProjectId ? 'bg-white/10 border-[#B9FF68]' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold uppercase tracking-tight">{project.name}</h2>
                            {project.id === activeProjectId && (
                                <span className="bg-[#B9FF68] text-black text-[10px] px-2 py-0.5 rounded font-black uppercase">Active</span>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{project.description}</p>
                        
                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <button 
                                onClick={() => deleteProject(project.id)} 
                                className="text-xs font-bold uppercase text-red-500 hover:text-red-400">
                                Delete
                            </button>
                            <button 
                                onClick={() => router.push(`/projects/${project.id}/edit`)} 
                                className="text-xs font-bold uppercase text-blue-400 hover:text-blue-300">
                                Edit
                            </button>
                            <Link 
                                href={`/projects/${project.id}/stories`} 
                                className="text-xs font-bold uppercase text-[#B9FF68] ml-auto hover:underline">
                                Go to Stories →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            
            {displayedProjects.length === 0 && (
                <div className="mt-12 text-center p-12 border border-dashed border-white/10 rounded-3xl">
                    <p className="text-gray-500 uppercase font-bold tracking-widest">
                        {showAll ? "No projects found." : "No active project selected."}
                    </p>
                    {!showAll && <button onClick={() => setShowAll(true)} className="mt-4 text-[#B9FF68] text-xs font-bold uppercase underline">Show all projects</button>}
                </div>
            )}
        </div>
    )
}