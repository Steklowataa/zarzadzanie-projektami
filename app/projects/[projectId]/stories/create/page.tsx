"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { StoryService } from "@/lib/storyServices";
import { currentUser } from "@/types/mockUpUsers";
import BackBtn from "../../../../components/tasks/BackBtn";

export default function CreateStoryPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStory = {
      id: uuidv4(),
      name,
      description,
      status: "todo" as const,
      priority,
      projectId,
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    try {
      await StoryService.create(newStory);
      router.push(`/projects/${projectId}/stories`);
      router.refresh();
    } catch (error) {
      alert("Failed to create story");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <BackBtn title="Back to Stories" onClick={() => router.push(`/projects/${projectId}/stories`)} />
      
      <h1 className="text-3xl font-black uppercase italic mb-8 mt-4">Create New Story</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Story Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all"
            placeholder="Enter story name..."
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all h-32"
            placeholder="Describe the story goals..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#B9FF68] text-black font-black uppercase p-4 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
        >
          Create Story
        </button>
      </form>
    </div>
  );
}