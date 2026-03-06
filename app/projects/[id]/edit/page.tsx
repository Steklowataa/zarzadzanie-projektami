'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '../../../../types/project'
import { useActiveProject } from '../../../../lib/useActiveProject'

export default function EditProject({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()

  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const projectsFromStorage = JSON.parse(localStorage.getItem('projects') || '[]')
    const currentProject = projectsFromStorage.find((p: Project) => p.id === params.id)
    setAllProjects(projectsFromStorage)
    if (currentProject) {
      setProject(currentProject)
      setName(currentProject.name)
      setDescription(currentProject.description)
    }
  }, [params.id])

  const { activeProjectId, setActiveProject } = useActiveProject()

  const handleActive = () => {
    if (project) {
      setActiveProject(project.id)
    }
  }

  const isProjectActive = project?.id === activeProjectId

  const handleEdit = () => {
    const updated = allProjects.map(p =>
      p.id === params.id ? { ...p, name, description } : p
    )
    
    localStorage.setItem('projects', JSON.stringify(updated))
    router.push('/projects')
  }

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div key={params.id} className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">Edit: {project.name}</h1>
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        className="border-white border-2 rounded-md block mb-4 h-10 bg-transparent pl-2 w-full max-w-md"/>
      <input 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        className="border-white border-2 rounded-md block mb-4 h-24 bg-transparent pl-2 w-full max-w-md"/>
      <div className="flex gap-4">
        <button 
          onClick={handleEdit} 
          className="rounded-full px-8 h-10 bg-white text-black hover:bg-gray-200 transition-colors cursor-pointer">Save</button>
        <button 
          onClick={handleActive} 
          disabled={isProjectActive}
          className="rounded-full px-8 h-10 bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:bg-gray-400">
            {isProjectActive ? 'Aktywny' : 'Ustaw jako aktywny'}
        </button>
      </div>
    </div>
  )
}
