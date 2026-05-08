"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/types/task";
import { TaskService } from "@/lib/taskService";
import BackBtn from "@/components/tasks/BackBtn";
import { Priority} from "@/types/prioritets";

export default function CreateTaskPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params?.projectId as string;
  const storyId = params?.storyId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("low");
  const [timeofWork, setTimeofWork] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const newTask: Task = {
      id: uuidv4(),
      name: name,
      description: description,
      status: "todo",
      priority: priority,
      timeofWork: timeofWork,
      projectId: projectId,
      storyId: storyId,
      createdAt: new Date().toISOString(),
      ownerId: "", 
      dateStart: "",
      dateEnd: "",
    };

    try {
      await TaskService.create(newTask);
      router.push(`/projects/${projectId}/stories/${storyId}/tasks`);
      router.refresh();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <BackBtn 
        title="Back to Tasks" 
        onClick={() => router.push(`/projects/${projectId}/stories/${storyId}/tasks`)} 
      />
      
      <h1 className="text-3xl font-black uppercase italic mb-8 mt-4">Create New Task</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Task Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all"
            placeholder="Enter task name..."
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all appearance-none cursor-pointer"
              disabled={isSubmitting}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Time of Work */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Est. Hours
            </label>
            <input
              type="number"
              min="1"
              value={timeofWork}
              onChange={(e) => setTimeofWork(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all h-32"
            placeholder="What exactly needs to be done?"
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#B9FF68] text-black font-black uppercase p-4 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Launching..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}