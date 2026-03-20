"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { StoryService } from "@/lib/storyServices";
import { Story } from "@/types/story";

// KLUCZOWE: Musi być "export default"
export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  
  // Bezpieczne wyciąganie parametrów z URL
  const projectId = params?.projectId as string;
  const storyId = params?.storyId as string;

  const [formData, setFormData] = useState<Story | null>(null);

  useEffect(() => {
    if (storyId) {
      const story = StoryService.getById(storyId);
      if (story) {
        setFormData(story);
      } else {
        // Jeśli nie ma takiej historii, wróć do listy
        router.push(`/projects/${projectId}/stories`);
      }
    }
  }, [storyId, projectId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      StoryService.edit(formData);
      router.push(`/projects/${projectId}/stories`);
      // Router refresh wymusza odświeżenie danych po powrocie
      router.refresh();
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this story?")) {
      StoryService.delete(storyId);
      router.push(`/projects/${projectId}/stories`);
      router.refresh();
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono uppercase tracking-widest">
        Loading Story Data...
      </div>
    );
  }

  return (
    <div className="p-12 min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
      {/* Szklany kontener formularza z neonową ramką */}
      <div className="w-full max-w-2xl p-[2px] rounded-[30px] bg-gradient-to-br from-[#B9FF68] to-[#80CF23] shadow-[0_0_30px_rgba(185,255,104,0.15)]">
        <div className="bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-[28px] p-10">
          <h2 className="text-3xl font-black italic text-[#B9FF68] mb-8 tracking-tighter">EDIT_STORY</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Story Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B9FF68] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Description</label>
              <textarea 
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B9FF68] transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B9FF68] appearance-none cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#B9FF68] appearance-none cursor-pointer"
                >
                  <option value="todo">Todo</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6">
              <button 
                type="submit"
                className="w-full bg-[#B9FF68] text-black font-black py-4 rounded-full hover:scale-[1.02] transition-transform shadow-lg uppercase"
              >
                Save Changes
              </button>
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 border border-white/10 py-3 rounded-full hover:bg-white/5 transition uppercase text-xs font-bold tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 border border-red-500/50 text-red-500 py-3 rounded-full hover:bg-red-500/10 transition uppercase text-xs font-bold tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}