import BackBtn from "./BackBtn"
import CreateButton from "../CreateButton"

export default function Header({ story, router, projectId, storyId }: { story: any, router: any, projectId: string, storyId: string }) {
    return (
        <div className="relative z-20 mb-10">
        <BackBtn title="Back to Stories" router={router} projectId={projectId} />
        <div className="flex justify-between items-end mt-4">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              {story?.name || "Tasks"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm max-w-xl line-clamp-1">{story?.description}</p>
          </div>
          <CreateButton title="Create Task" router={router} projectId={projectId} storyId={storyId} />
        </div>
      </div>

    )
}