"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ProjectService } from "@/lib/ProjectService";
import BackBtn from "../../../components/tasks/BackBtn";
import { auth } from "@/firebase";


export default function CreateProjectPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const user = auth.currentUser

        if(!user) return;
        const newProject = {
            id: uuidv4(),
            name,
            description,
            ownerId: user.uid
        };

        await ProjectService.create(newProject);
        router.refresh()
        router.push("/projects"); 
        
    };

    return (
        <div className="p-8 max-w-xl mx-auto text-white">
            <BackBtn title="Back to Stories" onClick={() => router.push("/projects")} />
            <h1 className="text-3xl font-black uppercase italic mb-8">Create New Project</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Project Name</label>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all"
                        placeholder="Enter project name..."
                        required
                        id="inputName"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all h-32"
                        placeholder="What is this project about?"
                        required
                        id="inputDescription"
                    />
                </div>
                <button type="submit" className="w-full bg-[#B9FF68] text-black font-black uppercase p-4 rounded-xl hover:scale-[1.02] transition-transform">
                    Save Project
                </button>
            </form>
        </div>
    );
}