import { Task } from "@/types/task";
import { users } from "@/types/mockUpUsers";

export const TaskBoard = ({ tasks, onTaskClick }: { tasks: Task[], onTaskClick: (id: string) => void }) => {
  const columns = [
    { id: "todo", title: "TO DO" },
    { id: "in progress", title: "DOING" },
    { id: "done", title: "DONE" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {columns.map(col => (
        <div key={col.id} className="bg-white/5 rounded-[20px] p-4 min-h-[500px] border border-white/5 backdrop-blur-sm">
          <h3 className="text-xs font-black tracking-[0.2em] text-gray-400 mb-6 px-2">{col.title}</h3>
          
          
          <div className="space-y-4">
            {tasks.filter(t => t.status === col.id).map(task => (
              <div 
                key={task.id}
                onClick={() => onTaskClick(task.id)}
                className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 hover:border-[#B9FF68]/50 cursor-pointer transition group"
              >
                <h4 className="font-bold text-sm mb-2 group-hover:text-[#B9FF68]">{task.name}</h4>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-gray-500">
                     {users.find(u => u.id === task.ownerId)?.name || "Unassigned"}
                   </span>
                   <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-blue-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;