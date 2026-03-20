"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Story } from "@/types/story";
import { StoryService } from "../../../../lib/storyServices";
import { StatusTabs } from "../../../components/stories/StatusBar";
import { StoryCard } from "../../../components/stories/StoryCard";
import Image from "next/image";

export default function StoriesPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStatus, setActiveStatus] = useState<Story["status"]>("todo");

  useEffect(() => {
    setStories(StoryService.getAllByProject(projectId));
  }, [projectId]);

  const theme = {
    todo: {
      gradient: "linear-gradient(to bottom right, #B9FF68, #80CF23)",
      glow: "0 0 30px rgba(185, 255, 104, 0.2)",
      accent: "#B9FF68"
    },
    "in progress": {
      gradient: "linear-gradient(to bottom right, #FFB347, #FFCC33)",
      glow: "0 0 30px rgba(255, 179, 71, 0.2)",
      accent: "#FFB347"
    },
    done: {
      gradient: "linear-gradient(to bottom right, #FFFFFF, #9CA3AF)",
      glow: "0 0 30px rgba(255, 255, 255, 0.1)",
      accent: "#FFFFFF"
    }
  };

  const currentTheme = theme[activeStatus];
  const filteredStories = stories.filter(s => s.status === activeStatus);

  return (
    <div className="relative p-12 min-h-screen text-white">
      {/* TŁO - FIXED */}
      <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
        <Image alt="bg" fill src="/images/bg-kanban.png" className="object-cover opacity-60" priority />
      </div>

      {/* Nagłówek */}
      <div className="relative z-20 flex justify-between items-end mb-6 px-2">
        <h1 className="text-4xl font-black italic tracking-tighter transition-colors duration-700" 
            style={{ color: currentTheme.accent }}>
          PROJECT_STORIES
        </h1>
      </div>

      <StatusTabs activeStatus={activeStatus} onStatusChange={setActiveStatus} />
      
      {/* 1. KONTENER RAMKI (Gradient + Glow) */}
      <div 
        className="relative rounded-[40px] p-[3px] transition-all duration-700 ease-in-out"
        style={{ 
          backgroundImage: currentTheme.gradient,
          boxShadow: currentTheme.glow 
        }}
      >
        {/* 2. WARSTWA BLURA (Izolowana) */}
        {/* Ten div nie ma dzieci, zajmuje się tylko rozmyciem tła pod sobą */}
        <div 
          className="absolute inset-[3px] rounded-[37px] z-0"
          style={{
            backgroundColor: "rgba(30, 30, 30, 0.4)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        />

        {/* 3. WARSTWA TREŚCI (Z-index wyżej niż blur) */}
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