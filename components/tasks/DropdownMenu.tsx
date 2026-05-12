"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { User } from "@/settings";
import { Loader2 } from "lucide-react"; // Opcjonalnie do ikonki ładowania

interface DropdownMenuProps {
  setDropdown: (id: string | null) => void;
  users: User[];
  task: Task;
  handleAssignUser: (e: React.MouseEvent, taskId: string, userId: string) => Promise<void>; // Zmienione na Promise
}

export default function DropdownMenu({
  setDropdown,
  users,
  task,
  handleAssignUser,
}: DropdownMenuProps) {
  // Dodajemy lokalny stan ładowania, aby zapobiec wielokrotnym kliknięciom
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  return (
    <>
      {/* Overlay - zamyka po kliknięciu poza menu */}
      <div
        className="fixed inset-0 z-30"
        onClick={(e) => {
          e.stopPropagation();
          if (!loadingUserId) setDropdown(null);
        }}
      />

      <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden backdrop-blur-xl">
        <div className="p-2 text-[9px] uppercase tracking-widest text-gray-500 font-black border-b border-white/5 bg-black/20">
          Assign Person
        </div>

        <div className="max-h-48 overflow-y-auto custom-scrollbar">
          {users
            .filter((u) => u.role !== "admin")
            .map((user) => {
              const isLoading = loadingUserId === user.id;

              return (
                <button
                  key={user.id}
                  disabled={!!loadingUserId} // Blokuj wszystkie przyciski podczas ładowania
                  onClick={async (e) => {
                    setLoadingUserId(user.id);
                    try {
                      // Czekamy aż funkcja nadrzędna (z Firebase) skończy pracę
                      await handleAssignUser(e, task.id, user.id);
                    } finally {
                      setLoadingUserId(null);
                      // Dropdown zamknie się automatycznie, bo handleAssignUser robi setDropdown(null)
                    }
                  }}
                  className={`w-full text-left px-4 py-3 text-xs transition-all flex items-center justify-between border-b border-white/5 last:border-0 
                    ${isLoading ? "bg-[#B9FF68]/20 cursor-wait" : "hover:bg-[#B9FF68] hover:text-black"}
                    ${!!loadingUserId && !isLoading ? "opacity-50" : "opacity-100"}
                  `}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold uppercase tracking-tight">
                      {user.name}
                    </span>
                    <span className={`text-[8px] uppercase font-medium ${isLoading ? "text-white" : "opacity-60"}`}>
                      {user.role}
                    </span>
                  </div>

                  {isLoading && <Loader2 size={14} className="animate-spin" />}
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
}