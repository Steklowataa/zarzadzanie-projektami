import BackBtn from "./BackBtn"
import CreateButton from "../CreateButton"
import { Story } from "@/types/story"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface HeaderTaskProps {
    story: Story | undefined;
    router: AppRouterInstance;
    projectId: string;
    storyId: string;
}

export default function HeaderTask({ story, router, projectId, storyId }: HeaderTaskProps) {
    return (
        <div className="relative z-20 mb-10">
        <BackBtn title="Back to Stories" onClick={() => router.push(`/projects/${projectId}/stories`)}/>
        <div className="flex justify-between items-end mt-4">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              {story?.name || "Tasks"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm max-w-xl line-clamp-1">{story?.description}</p>
          </div>
          <CreateButton 
            title="Create Task" 
            onClick={() => router.push(`/projects/${projectId}/stories/${storyId}/tasks/create`)} />
        </div>
      </div>

    )
}