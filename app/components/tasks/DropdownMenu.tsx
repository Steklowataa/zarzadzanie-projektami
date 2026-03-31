import { User } from "@/types/user"; 
import { Task } from "@/types/task";

interface DropdownMenuProps {
  setDropdown: (id: string | null) => void;
  users: User[];
  task: Task; 
  handleAssignUser: (e: React.MouseEvent, taskId: string, userId: string) => void;
}

export default function DropdownMenu({ 
  setDropdown, 
  users, 
  task, 
  handleAssignUser 
}: DropdownMenuProps) {
  return (
    <>
      <div 
        className="fixed inset-0 z-30" 
        onClick={(e) => {
          e.stopPropagation();
          setDropdown(null);
        }} 
      />
      <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden backdrop-blur-xl">
        <div className="p-2 text-[9px] uppercase tracking-widest text-gray-500 font-black border-b border-white/5 bg-black/20">
          Assign Person
        </div>
        <div className="max-h-48 overflow-y-auto">
          {users.filter(u => u.role !== 'admin').map(user => (
            <button
              key={user.id}
              onClick={(e) => handleAssignUser(e, task.id, user.id)}
              className="w-full text-left px-4 py-3 text-xs hover:bg-[#B9FF68] hover:text-black transition-colors flex flex-col gap-0.5 border-b border-white/5 last:border-0"
            >
              <span className="font-bold uppercase tracking-tight">{user.name}</span>
              <span className="text-[8px] opacity-60 uppercase font-medium">{user.role}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}