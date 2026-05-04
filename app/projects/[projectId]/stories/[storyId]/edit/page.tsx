"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { StoryService } from "@/lib/storyServices";
import { Story } from "@/types/story";
import BackBtn from "../../../../../components/tasks/BackBtn";

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  
  const projectId = params?.projectId as string;
  const storyId = params?.storyId as string;

  const [formData, setFormData] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      if (storyId) {
        try {
          const story = await StoryService.getById(storyId);
          if (story) {
            setFormData(story);
          } else {
            router.push(`/projects/${projectId}/stories`);
          }
        } catch (error) {
          console.error("Błąd podczas pobierania historii:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStory();
  }, [storyId, projectId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        await StoryService.edit(formData);
        router.push(`/projects/${projectId}/stories`);
        router.refresh();
      } catch (error) {
        alert("Wystąpił błąd podczas zapisywania zmian.");
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await StoryService.delete(storyId);
        router.push(`/projects/${projectId}/stories`);
        router.refresh();
      } catch (error) {
        alert("Nie udało się usunąć historii.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-black italic uppercase tracking-widest">
        Loading Story Data...
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="p-8 max-w-xl mx-auto text-white min-h-screen">
      <BackBtn 
        title="Back to Stories" 
        onClick={() => router.push(`/projects/${projectId}/stories`)} 
      />
      
      <h1 className="text-3xl font-black uppercase italic mb-8 mt-4">
        Edit Story: <span className="text-[#B9FF68]">{formData.name}</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Story Name
          </label>
          <input 
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all text-white"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Description
          </label>
          <textarea 
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all h-32 text-white resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Priority
            </label>
            <select 
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Status
            </label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="todo">Todo</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button 
            type="submit"
            className="w-full bg-[#B9FF68] text-black font-black uppercase p-4 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
          >
            Save Changes
          </button>

          <button 
            type="button"
            onClick={handleDelete}
            className="w-full border border-red-500/50 text-red-500 font-black uppercase p-4 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer text-sm"
          >
            Delete Story
          </button>
        </div>
      </form>
    </div>
  );
}