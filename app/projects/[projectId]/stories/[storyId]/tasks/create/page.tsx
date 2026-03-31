"use client"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/types/task";
import { TaskService } from "@/lib/taskService";
import { ArrowLeft, Clock, AlignLeft, Zap } from "lucide-react";

export default function CreateTaskPage() {
  const { projectId, storyId } = useParams() as { projectId: string; storyId: string };
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "low" as Task["priority"],
    timeofWork: "1", 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: uuidv4(),
      name: formData.name,
      description: formData.description,
      status: "todo", 
      priority: formData.priority,
      timeofWork: formData.timeofWork,
      projectId: projectId,
      storyId: storyId,
      createdAt: new Date().toISOString(),
      ownerId: "", // Na razie puste, przypiszemy osobę w szczegółach
      dateStart: "",
      dateEnd: "",
    };

    TaskService.create(newTask);
    router.push(`/projects/${projectId}/stories/${storyId}/tasks`);
    router.refresh();
  };

  return (
    <div className="p-12 min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-2xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8 uppercase text-[10px] tracking-widest font-bold"
        >
          <ArrowLeft size={14} /> Cancel and return
        </button>

        <div className="p-[2px] rounded-[40px] bg-gradient-to-br from-[#B9FF68] to-[#25B3FF]">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-[38px] p-10 shadow-2xl">
            <h1 className="text-4xl font-black italic tracking-tighter mb-10 text-[#B9FF68]">
              CREATE_NEW_TASK
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Task Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  <Zap size={12} /> Task Title
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#B9FF68] transition text-lg"
                  placeholder="e.g. Design database schema"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  <AlignLeft size={12} /> Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#B9FF68] transition resize-none"
                  placeholder="What exactly needs to be done?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-2xl px-5 py-4 outline-none cursor-pointer focus:border-[#B9FF68]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Estimated Time */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <Clock size={12} /> Est. Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.timeofWork}
                    onChange={(e) => setFormData({ ...formData, timeofWork: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#B9FF68]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#B9FF68] text-black font-black py-5 rounded-full hover:scale-[1.02] transition shadow-[0_10px_30px_rgba(185,255,104,0.2)] uppercase text-sm tracking-widest mt-4"
              >
                Launch Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}