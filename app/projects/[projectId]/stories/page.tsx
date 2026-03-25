"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CreateButton from "../../../components/stories/CreateButton";
import { Story } from "@/types/story";
import { StoryService } from "../../../../lib/storyServices";
import { StatusTabs } from "../../../components/stories/StatusBar";
import { StoryCard } from "../../../components/stories/StoryCard";
import Image from "next/image";
import { useActiveProject } from "../../../../lib/useActiveProject";
import { Project } from "../../../../types/project";
import theme from "../../../themes/theme"


export default function StoriesPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStatus, setActiveStatus] = useState<Story["status"]>("todo");

  const { activeProjectId, setActiveProject } = useActiveProject()
  const [projects, setProjects] = useState<Project[]>(() => {
          if (typeof window !== "undefined") {
              return JSON.parse(localStorage.getItem("projects") || "[]")
          }
          return []
      })
  const activeProject = projects.find(p => p.id === activeProjectId)

  useEffect(() => {
    setStories(StoryService.getAllByProject(projectId));
  }, [projectId]);


  const currentTheme = theme[activeStatus];
  const filteredStories = stories.filter(s => s.status === activeStatus);

  return (
    <div className="relative p-12 min-h-screen text-white">
      <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
        <Image alt="bg" fill src="/images/bg-kanban.png" className="object-cover opacity-60" priority />
      </div>

      {/* Nagłówek */}
      <div className="relative z-20 flex justify-between items-end mb-6 px-2">
        <h1 className="text-4xl font-black italic tracking-tighter transition-colors duration-700" 
            style={{ color: currentTheme.accent }}>
          { activeProject?.name || "Project" }
        </h1>
        <CreateButton title="Create Story" onClick={() => router.push(`/projects/${projectId}/stories/create`)} />
      </div>

      <StatusTabs activeStatus={activeStatus} onStatusChange={setActiveStatus} />
      
      {/* KONTENER RAMKI */}
      <div 
        className="relative rounded-[40px] p-[3px] transition-all duration-700 ease-in-out"
        style={{ 
          backgroundImage: currentTheme.gradient,
          boxShadow: currentTheme.glow 
        }}
      >
        {/* WARSTWA BLURA */}
        <div 
          className="absolute inset-[3px] rounded-[37px] z-0"
          style={{
            backgroundColor: "rgba(30, 30, 30, 0.4)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        />

        {/*  WARSTWA TREŚCI */}
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