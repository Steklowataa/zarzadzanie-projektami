'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '../../../../types/project'
import { useActiveProject } from '../../../../lib/useActiveProject'
import { ProjectService } from '../../../../lib/ProjectService'
import BackBtn  from '../../../components/tasks/BackBtn'


export default function EditProject({ params: paramsPromise }: { params: Promise<{ projectId: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  
  const [project, setProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Używamy params.projectId, bo tak nazwałaś parametr w definicji
        const currentProject = await ProjectService.getById(params.projectId)
        if (currentProject) {
          setProject(currentProject)
          setName(currentProject.name)
          setDescription(currentProject.description)
        }
      } catch (error) {
        console.error("Błąd podczas ładowania projektu:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.projectId]) // Poprawiona zależność

  const { activeProjectId, setActiveProject } = useActiveProject()

  const handleActive = () => {
    if (project) {
      setActiveProject(project.id)
    }
  }

  const isProjectActive = project?.id === activeProjectId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    try {
      await ProjectService.update({ 
        ...project, 
        name, 
        description 
      })
      
      router.push('/projects')
      router.refresh()
    } catch (error) {
      alert("Wystąpił błąd podczas zapisywania zmian.")
    }
  }

  if (isLoading) {
    return <div className="p-8 max-w-xl mx-auto text-white uppercase font-black italic">Loading...</div>
  }

  if (!project) {
    return <div className="p-8 max-w-xl mx-auto text-white uppercase font-black italic">Project not found.</div>
  }

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <BackBtn title="Back to Projects" onClick={() => router.push('/projects')} />
      <h1 className="text-3xl font-black uppercase italic mb-8">
        Edit: <span className="text-[#B9FF68]">{project.name}</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Project Name
          </label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all text-white"
            placeholder="Enter project name..."
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Description
          </label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-[#B9FF68] outline-none transition-all h-32 text-white"
            placeholder="What is this project about?"
            required
          />
        </div>

        <div className="flex flex-col gap-4">
          <button 
            type="submit" 
            className="w-full bg-[#B9FF68] text-black font-black uppercase p-4 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
          >
            Save Changes
          </button>

          <button 
            type="button" // Ważne, żeby nie triggerował submitu formularza
            onClick={handleActive} 
            disabled={isProjectActive}
            className={`w-full p-4 rounded-xl font-black uppercase text-sm transition-all cursor-pointer
              ${isProjectActive 
                ? 'bg-white/10 text-gray-500 border border-white/10 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-200'}`}
          >
            {isProjectActive ? 'Project is Active' : 'Set as Active Project'}
          </button>
        </div>
      </form>
    </div>
  )
}