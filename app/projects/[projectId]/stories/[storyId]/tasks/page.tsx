"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskService } from "@/lib/taskService";
import { StoryService } from "@/lib/storyServices";
import { Task } from "@/types/task";
import { Story } from "@/types/story";
import Image from "next/image";
import { users } from "@/types/mockUpUsers";
import TaskCard from "../../../../../components/tasks/TaskCard";
import { columns } from "@/types/themes/themes"
import Header from "../../../../../components/tasks/Header"

export default function TaskKanbanPage() {
  const { projectId, storyId } = useParams() as any;
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [openDropdown, setDropdown] = useState<string | null>(null);

  const refreshTask = () => {
    setTasks(TaskService.getAllByStory(storyId));
  };

  //dropdown dla status
  const handleComplete = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation()
    TaskService.completeTask(taskId)
    setDropdown(null)
    refreshTask()
  }

  //dropdown dla wyboru usera
  const handleAssignUser = (e: React.MouseEvent, taskId: string, userId: string) => {
    e.stopPropagation();
    TaskService.assignUser(taskId, userId);
    setDropdown(null);
    refreshTask(); 
  };

  useEffect(() => {
    refreshTask();
    setStory(StoryService.getById(storyId));
  }, [storyId]);



  return (
    <div className="relative p-12 min-h-screen text-white">
      <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
        <Image alt="bg" fill src="/images/bg-kanban.png" className="object-cover opacity-40" priority />
      </div>

      {/* Header */}
      <Header router={router} story={story} projectId={projectId} storyId={storyId} />

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {columns.map(col => (
          <div key={col.id} className="flex flex-col h-full">
            {/* Column Header */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
              <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
                {col.title} ({tasks.filter(t => t.status === col.id).length})
              </h2>
            </div>

            {/* Column Content */}
            <div className="flex-grow rounded-[32px] p-4 min-h-[600px] bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="space-y-4">
                {tasks.filter(t => t.status === col.id).map(task => {
                  const owner = users.find(u => u.id === task.ownerId);

                  return (
                    <div 
                      key={task.id}
                      onClick={() => router.push(`/projects/${projectId}/stories/${storyId}/tasks/${task.id}`)}
                      className="group bg-[#1a1a1a]/80 p-5 rounded-2xl border border-white/5 hover:border-[#B9FF68]/40 transition-all cursor-pointer shadow-lg relative">
                      <TaskCard 
                        task={task} 
                        owner={owner} 
                        openDropdown={openDropdown} 
                        setDropdown={setDropdown}
                        users={users}
                        handleAssignUser={handleAssignUser}
                        handleComplete={handleComplete} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}