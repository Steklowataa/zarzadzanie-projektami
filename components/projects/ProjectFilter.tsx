"use client"
import { useState } from "react"
import { ChevronDown, Layers, LayoutGrid } from "lucide-react"

interface ProjectFilterProps {
    showAll: boolean,
    setShowAll: (value: boolean) => void,
}
export default function ProjectFilter({ showAll, setShowAll }: ProjectFilterProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative inline-block text-left mb-6 cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl transition-all">
        {showAll ? <LayoutGrid size={16} /> : <Layers size={16} />}
        <span className="text-sm font-bold uppercase tracking-wider">
          {showAll ? "All Projects" : "Active Project Only"}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          
          <div className="absolute left-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden backdrop-blur-xl">
            <button
              onClick={() => { setShowAll(false); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 text-xs cursor-pointer uppercase font-bold flex items-center gap-2 hover:bg-white/5 transition-colors ${!showAll ? "text-[#B9FF68]" : "text-gray-400"}`}>
              <Layers size={14} />
              Active Project
            </button>
            <button
              onClick={() => { setShowAll(true); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 cursor-pointer text-xs uppercase font-bold flex items-center gap-2 hover:bg-white/5 transition-colors ${showAll ? "text-[#B9FF68]" : "text-gray-400"}`}>
              <LayoutGrid size={14} />
              Show All Projects
            </button>
          </div>
        </>
      )}
    </div>
    )
}