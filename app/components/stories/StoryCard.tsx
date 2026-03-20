import { Story } from "@/types/story";
import { Lightbulb, PencilLine } from "lucide-react";
import { STORY_PRIORITIES, PriorityLevel } from "../../../types/prioritets"

interface StoryCardProps {
  story: Story;
  accentColor: string;
}

export const StoryCard = ({ story, accentColor }: StoryCardProps) => {
  const priorityConfig = STORY_PRIORITIES[story.priority as PriorityLevel] || STORY_PRIORITIES.low;
  
  return (
    <div 
      className="relative rounded-2xl p-[1px] transition-all duration-700"
      style={{ background: `linear-gradient(to bottom right, ${accentColor}, transparent)` }}>
      <div className="bg-black/60 backdrop-blur-xs rounded-2xl p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{story.name}</h3>
          <button className="text-gray-400 hover:text-white transition cursor-pointer">
            <PencilLine size={18} />
          </button>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-8 flex-grow">
          {story.description}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
            {new Date(story.createdAt).toLocaleDateString()}
          </span>
          
          <div className="relative group/tooltip cursor-pointer">
            {/* Żarówka świeci w kolorze sekcji */}
            <Lightbulb 
              size={22} 
              style={{ 
                color: priorityConfig.color, 
                filter: `drop-shadow(0 0 8px ${accentColor})` 
              }} 
              fill="currentColor"
            />
            <span className="absolute bottom-full w-[80] left-7 text-black hidden group-hover/tooltip:block bg-white/60 border border-white/20 text-[10px] px-2 py-1 rounded">
              Priority: {story.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};