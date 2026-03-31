"use client"
import { Clock, User as UserIcon } from "lucide-react";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import DropdownMenu from "./DropdownMenu"; 
import { Lightbulb} from "lucide-react";
import { STORY_PRIORITIES, PriorityLevel } from "../../../types/prioritets"

interface TaskCardProps {
  task: Task;
  owner: User | undefined;
  isDropdownOpen: boolean;
  setDropdown: (id: string | null) => void;
  users: User[];
  handleAssignUser: (e: React.MouseEvent, taskId: string, userId: string) => void;
}

export default function TaskCard({task,owner,isDropdownOpen,setDropdown,users,handleAssignUser,}: TaskCardProps) {
    const priorityConfig = STORY_PRIORITIES[task.priority as PriorityLevel] || STORY_PRIORITIES.low;


  return (
        <>
         <div className="flex items-center gap-3 mb-4">
            <div className="relative group/tooltip cursor-pointer">
            <Lightbulb 
                size={18} 
                style={{ 
                    color: priorityConfig.color, 
                    filter: `drop-shadow(0 0 8px ${priorityConfig.color})` 
                }} 
              fill="currentColor"/>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] w-max px-3 py-1.5 bg-white/80 backdrop-blur-md 
                text-black text-[10px] font-bold uppercase tracking-wider
                rounded-lg border border-white/40
                pointer-events-none
                hidden group-hover/tooltip:block
                shadow-[0_4_15px_rgba(0,0,0,0.3)]">
                Priority: {task.priority}
            </span>
            </div>

            <h4 className="font-bold text-sm group-hover:text-[#B9FF68] transition-colors uppercase tracking-tight leading-tight">
            {task.name}
            </h4>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="relative">
            <div
            onClick={(e) => {
                e.stopPropagation();
                setDropdown(isDropdownOpen ? null : task.id);
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                <UserIcon
                size={12}
                className={owner ? "text-[#B9FF68]" : "text-gray-400"}/>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase hover:text-white">
                {owner ? owner.name : "Unassigned"}
            </span>
            </div>

            {isDropdownOpen && (
            <DropdownMenu
                setDropdown={setDropdown}
                users={users}
                task={task}
                handleAssignUser={handleAssignUser}/>
            )}
        </div>

        <div className="flex items-center gap-1 text-gray-600">
            <Clock size={10} />
            <span className="text-[9px] font-mono">{task.timeofWork}h</span>
        </div>
        </div>
    </>
  );
}