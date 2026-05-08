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

export default function StoriesPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeStatus, setActiveStatus] = useState<Story["status"]>("todo");
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
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

  if (isLoading) {
    return <div className="p-12 text-white font-black italic uppercase">Loading Stories...</div>;
  }

  return (
    <div className="relative p-12 min-h-screen text-white">
      <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
        <Image alt="bg" fill src="/images/bg-kanban.png" className="object-cover opacity-60" priority />
      </div>
      
      <BackBtn title="Back to Projects" onClick={() => router.push(`/projects/`)}/>
      
      <div className="relative z-20 flex justify-between items-end mb-6 px-2">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black italic tracking-tighter transition-colors duration-700" 
              style={{ color: currentTheme.accent }}>
            { activeProject?.name || "Untitled Project" }
          </h1>
        </div>
       <CreateButton 
          title="Create Story" 
          onClick={() => router.push(`/projects/${projectId}/stories/create`)} />
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
            {filteredStories.map((story) => (
              <StoryCard 
                key={story.id} 
                story={story} 
                accentColor={currentTheme.accent} 
              />
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-gray-500 font-medium tracking-wide">NO STORIES IN THIS CATEGORY</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}