"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Project {
    id: string,
    name: string,
    description: string
}


export default function CreatePage() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const router = useRouter()

    const handleCreate = () => {
        if(!name) throw new Error("Nazwa jest wymagana")

        const projects = JSON.parse(localStorage.getItem("projects") || "[]")
        const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            description
        }
        projects.push(newProject)
        localStorage.setItem("projects", JSON.stringify(projects))
        router.push("/projects")
    }
    return (
        <div>
            <h1>Create Page</h1>
            <input type="text" 
                value={name} 
                placeholder="Nazwa" 
                onChange={e => setName(e.target.value)} 
                className="border-white border-2 rounded-md m-6 h-10 text-white pl-2 "/>
            <input 
                type="text" 
                value={description} 
                placeholder="Opis" 
                onChange={e => setDescription(e.target.value)} 
                className="border-white border-2 rounded-md m-6 h-10 text-white pl-2 "/>
            <button 
                onClick={handleCreate} 
                className="rounded-4xl w-30 h-10 bg-white text-black cursor-pointer">Create</button>
        </div>
    )
}