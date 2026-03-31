"use client"
import { Clock, User as UserIcon, Lightbulb, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import DropdownMenu from "./DropdownMenu"; 
import { STORY_PRIORITIES, PriorityLevel } from "../../../types/prioritets"

interface TaskCardProps {
  task: Task;
  owner: User | undefined;
  openDropdown: string | null;
  setDropdown: (id: string | null) => void;
  users: User[];
  handleAssignUser: (e: React.MouseEvent, taskId: string, userId: string) => void;
  handleComplete: (e: React.MouseEvent, taskId: string) => void;
}

export default function TaskCard({
  task,
  owner,
  openDropdown, 
  setDropdown,
  users,
  handleAssignUser,
  handleComplete
}: TaskCardProps) {
  const priorityConfig = STORY_PRIORITIES[task.priority as PriorityLevel] || STORY_PRIORITIES.low;

  const userDropdownKey = `${task.id}-user`;
  const statusDropdownKey = `${task.id}-status`;

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
            fill="currentColor"
          />
        </div>
        <h4 className="font-bold text-sm group-hover:text-[#B9FF68] transition-colors uppercase tracking-tight leading-tight">
          {task.name}
        </h4>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        
        {/* LEWA STRONA: PRZYPISANIE UŻYTKOWNIKA */}
        <div className="relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              // Jeśli ten dropdown jest już otwarty, zamknij go. Jeśli nie, otwórz go.
              setDropdown(openDropdown === userDropdownKey ? null : userDropdownKey);
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
              <UserIcon size={12} className={owner ? "text-[#B9FF68]" : "text-gray-400"}/>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              {owner ? owner.name : "Unassigned"}
            </span>
          </div>

          {/* Renderuj dropdown TYLKO jeśli klucz się zgadza */}
          {openDropdown === userDropdownKey && (
            <DropdownMenu
              setDropdown={setDropdown}
              users={users}
              task={task}
              handleAssignUser={handleAssignUser}
            />
          )}
        </div>

        {/* ŚRODEK: STATUS */}
        <div className="relative">
          {task.status === "done" ? (
             <div className="flex flex-col items-center">
                <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Finished</span>
                <span className="text-[9px] text-[#B9FF68] font-mono">
                    {task.dateEnd ? new Date(task.dateEnd).toLocaleDateString() : "--"}
                </span>
             </div>
          ) : (
            <div className="relative">
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdown(openDropdown === statusDropdownKey ? null : statusDropdownKey);
                  }}
                  className="text-[10px] text-gray-500 font-black uppercase tracking-widest cursor-pointer hover:text-[#B9FF68] transition-colors bg-white/5 px-2 py-1 rounded"
                >
                  {task.status === "in progress" ? "Doing" : "Todo"}
                </div>

                {openDropdown === statusDropdownKey && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={(e) => { e.stopPropagation(); setDropdown(null); }} 
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-40 overflow-hidden">
                        <button
                          onClick={(e) => handleComplete(e, task.id)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-3 text-[10px] font-black uppercase text-[#B9FF68] hover:bg-[#B9FF68] hover:text-black transition-all"
                        >
                          <CheckCircle2 size={12} />
                          Set Done
                        </button>
                    </div>
                  </>
                )}
            </div>
          )}
        </div>

        {/* PRAWA STRONA: CZAS */}
        <div className="flex items-center gap-1 text-gray-600">
          <Clock size={10} />
          <span className="text-[9px] font-mono">{task.timeofWork}h</span>
        </div>
      </div>
    </>
  );
}