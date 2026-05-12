"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/types/task";
import { TaskService } from "@/lib/taskService";
import BackBtn from "@/components/tasks/BackBtn";
import { Priority } from "@/types/prioritets";
import { auth } from "@/firebase"

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
    const currentUser = auth.currentUser
    
    if(!currentUser) {
      alert("Nie jestes zalogowany")
      return
    }

    setIsSubmitting(true);

    const newTask: Task = {
      id: uuidv4(),
      name,
      description,
      status: "todo",
      priority,
      timeofWork,
      projectId,
      storyId,
      createdAt: new Date().toISOString(),
      ownerId: currentUser.uid,
      dateStart: "",
      dateEnd: "",
      assignUserId: undefined
    };

    try {
      await TaskService.create(newTask);
      router.push(
        `/projects/${projectId}/stories/${storyId}/tasks`
      );
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
        onClick={() =>
          router.push(
            `/projects/${projectId}/stories/${storyId}/tasks`
          )
        }
      />

      <h1 className="text-3xl font-black uppercase italic mb-8 mt-4">
        Create New Task
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          id="inputName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task name"
          required
          disabled={isSubmitting}
          className="w-full bg-white/5 p-4 rounded-xl"
        />

        <textarea
          id="inputDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          disabled={isSubmitting}
          className="w-full bg-white/5 p-4 rounded-xl h-32"
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as Priority)
          }
          disabled={isSubmitting}
          className="w-full bg-[#1a1a1a] p-4 rounded-xl"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          id="inputTimeofWork"
          type="number"
          min="1"
          value={timeofWork}
          onChange={(e) =>
            setTimeofWork(e.target.value)
          }
          required
          disabled={isSubmitting}
          className="w-full bg-white/5 p-4 rounded-xl"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#B9FF68] text-black font-bold p-4 rounded-xl"
        >
          {isSubmitting ? "Loading..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}