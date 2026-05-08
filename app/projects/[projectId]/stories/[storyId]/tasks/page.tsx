'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskService } from "@/lib/taskService";
import { StoryService } from "@/lib/storyServices";
import { Task } from "@/types/task";
import { Story } from "@/types/story";
import Image from "next/image";
import { User } from "@/settings"; 
import TaskCard from "../../../../../../components/tasks/TaskCard";
import { columns } from "@/types/themes/themes"
import Header from "../../../../../../components/tasks/HeaderTask"
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import SkeletonTask from "../../../../../../components/tasks/SkeletonTask";




export default function TaskKanbanPage() {
  const { projectId, storyId } = useParams<{ projectId: string; storyId: string }>();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [openDropdown, setDropdown] = useState<string | null>(null);
  const [appUsers, setAppUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);


  const refreshData = async () => {
    try {
      const fetchedTasks = await TaskService.getAllByStory(storyId);
      const fetchedStory = await StoryService.getById(storyId);
      setTasks(fetchedTasks);
      setStory(fetchedStory);
    } catch (error) {
      console.error("Błąd podczas odświeżania danych:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId));

    try {
        await TaskService.delete(taskId);
    } catch (error) {
        setTasks(previousTasks);
        alert("Nie udało się usunąć zadania.");
      }
};

  const fetchUsers = async () => {
    try {
      const q = query(
        collection(db, "users"), 
        where("role", "in", ["developer", "devops"])
      );
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id 
      })) as User[];
      
      setAppUsers(usersList);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników:", error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      if(tasks.length === 0) setLoading(true)
      await Promise.all([refreshData(), fetchUsers()]);
      setLoading(false);
    };
    initPage();
  }, [storyId]);


  const handleComplete = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'done', dateEnd: new Date().toISOString() } : t));
    setDropdown(null);

    try { 
      await TaskService.completeTask(taskId);
    } catch (error) {
      setTasks(previousTasks)
    }
  };


  const handleAssignUser = async (e: React.MouseEvent, taskId: string, userId: string) => {
    e.stopPropagation();
    const previousTasks = [...tasks];

    setTasks(tasks.map(t => t.id === taskId ? { ...t, ownerId: userId, status: 'in progress' } : t));
    setDropdown(null);
    try {
      await TaskService.assignUser(taskId, userId);
    } catch (error) {
      setTasks(previousTasks);
    }
  };

 return (
    <div className="relative p-12 min-h-screen text-white">
      <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
        <Image alt="bg" fill src="/images/bg-kanban.png" className="object-cover opacity-40" priority />
      </div>

      <Header router={router} story={story} projectId={projectId} storyId={storyId} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {columns.map(col => (
          <div key={col.id} className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
              <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
                {col.title} ({loading && tasks.length === 0 ? "..." : tasks.filter(t => t.status === col.id).length})
              </h2>
            </div>

            <div className="flex-grow rounded-[32px] p-4 min-h-[600px] bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="space-y-4">
                {loading && tasks.length === 0 ? (
                  <>
                    <SkeletonTask />
                  </>
                ) : (
                  tasks
                    .filter(t => t.status === col.id)
                    .map(task => {
                      const owner = appUsers.find(u => u.id === task.ownerId);
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
                            users={appUsers}
                            handleAssignUser={handleAssignUser}
                            handleComplete={handleComplete}
                            onDelete={handleDeleteTask}
                          />
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}