"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CreateButton from "../../../../components/CreateButton";
import { Story } from "@/types/story";
import { StoryService } from "@/lib/storyServices"; 
import { ProjectService } from "../../../../lib/ProjectService";
import { StatusTabs } from "../../../../components/stories/StatusBar";
import { StoryCard } from "../../../../components/stories/StoryCard";
import Image from "next/image";
import { Project } from "../../../../types/project";
import { theme } from "@/types/themes/themes";
import BackBtn from "../../../../components/tasks/BackBtn";

const StorySkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-3xl h-48 w-full animate-pulse flex flex-col p-6 space-y-4">
    <div className="h-6 bg-white/10 rounded w-3/4"></div>
    <div className="h-4 bg-white/5 rounded w-full"></div>
    <div className="h-4 bg-white/5 rounded w-5/6"></div>
    <div className="mt-auto h-8 bg-white/10 rounded w-1/4"></div>
  </div>
);

export default function StoriesPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeStatus, setActiveStatus] = useState<Story["status"]>("todo");
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [projectData, storiesData] = await Promise.all([
        ProjectService.getById(projectId),
        StoryService.getAllByProject(projectId)
      ]);
      
      if (projectData) setActiveProject(projectData);
      setStories(storiesData);
    } catch (error) {
      console.error("Error refreshing stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [projectId]);

  useEffect(() => {
    router.prefetch(`/projects/${projectId}/stories/create`)
  },[router, projectId])

  const currentTheme = theme[activeStatus];
  const filteredStories = stories.filter(s => s.status === activeStatus);

  return (
    <div className="relative p-12 min-h-screen text-white">
      <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
        <Image alt="bg" fill src="/images/bg-kanban.png" className="object-cover opacity-60" priority />
      </div>
      
      <BackBtn title="Back to Projects" onClick={() => router.push(`/projects/`)}/>
      
      <div className="relative z-20 flex justify-between items-end mb-6 px-2 mt-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black italic tracking-tighter transition-colors duration-700" 
              style={{ color: currentTheme.accent }}>
            { activeProject?.name || (isLoading ? "Loading..." : "Untitled Project") }
          </h1>
        </div>
        <CreateButton 
          title="Create Story" 
          onClick={() => router.push(`/projects/${projectId}/stories/create`)} 
        />
      </div>

      <StatusTabs activeStatus={activeStatus} onStatusChange={setActiveStatus} />
      
      <div 
        className="relative rounded-[40px] p-[3px] transition-all duration-700 ease-in-out"
        style={{ 
          backgroundImage: currentTheme.gradient,
          boxShadow: currentTheme.glow 
        }}>
        <div 
          className="absolute inset-[3px] rounded-[37px] z-0"
          style={{
            backgroundColor: "rgba(30, 30, 30, 0.4)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}/>

        <div className="relative z-10 p-10 min-h-[600px] rounded-[37px] border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {isLoading && stories.length === 0 ? (
              <>
                <StorySkeleton />
                <StorySkeleton />
                <StorySkeleton />
                <StorySkeleton />
                <StorySkeleton />
                <StorySkeleton />
              </>
            ) : (              
            <>
                {filteredStories.map((story) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    accentColor={currentTheme.accent} 
                  />
                ))}

                {!isLoading && filteredStories.length === 0 && (
                  <div className="col-span-full flex items-center justify-center h-[400px]">
                    <p className="text-gray-500 font-medium tracking-wide uppercase italic">
                      No stories in this category
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}