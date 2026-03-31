import { Story } from "@/types/story";
import { Lightbulb, PencilLine, Trash2 } from "lucide-react";
import { STORY_PRIORITIES, PriorityLevel } from "../../../types/prioritets"
import Link from "next/link";
import { useParams } from "next/navigation";
import { StoryService } from "../../../lib/storyServices";
import { useRouter} from "next/navigation";


interface StoryCardProps {
  story: Story;
  accentColor: string;
}


export const StoryCard = ({ story, accentColor }: StoryCardProps) => {
  const priorityConfig = STORY_PRIORITIES[story.priority as PriorityLevel] || STORY_PRIORITIES.low;
  const router = useRouter()
  const { projectId } = useParams()

  const handleFelete = (e: React.MouseEvent) => {
    e.preventDefault()
    if(confirm("Are you sure you want to delete this story?")) {
      StoryService.delete(story.id)
      router.refresh()
      window.location.reload()
    }
  }

  //przejscie do taskow
  const handleClick = () => {
    router.push(`/projects/${projectId}/stories/${story.id}/tasks`)
  }
  
  return (
    <div 
      onClick={handleClick}
      className="relative rounded-2xl p-[1px] transition-all duration-700 hover:scale-[1.05] cursor-pointer"
      style={{ background: `linear-gradient(to bottom right, ${accentColor}, transparent)` }}>
      <div className="bg-black/60 backdrop-blur-xs rounded-2xl p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{story.name}</h3>
          <div className="flex gap-4">
            <Link href={`/projects/${projectId}/stories/${story.id}/edit`}>
              <PencilLine size={18} />
            </Link>
            <button onClick={handleFelete} className="cursor-pointer">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-8 flex-grow">
          {story.description}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
          <span className="text-[10px] text-gray-300 uppercase tracking-widest font-mono">
            {new Date(story.createdAt).toLocaleDateString()}
          </span>
          
          <div className="relative group/tooltip cursor-pointer">
            {/* Żarówka świeci w kolorze sekcji */}
            <Lightbulb 
              size={22} 
              style={{ 
                color: priorityConfig.color, 
                filter: `drop-shadow(0 0 8px ${priorityConfig.color})` 
              }} 
              fill="currentColor"
            />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] w-max px-3 py-1.5 bg-white/80 backdrop-blur-md 
              text-black text-[10px] font-bold uppercase tracking-wider
              rounded-lg border border-white/40
              pointer-events-none
              hidden group-hover/tooltip:block
              shadow-[0_4_15px_rgba(0,0,0,0.3)]">
              Priority: {story.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};