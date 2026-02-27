'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '../../../../types/project'


export default function EditProject({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const allProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]')
  const project = allProjects.find(p => p.id === params.id)


  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')

  const handleEdit = () => {
    const updated = allProjects.map(p =>
      p.id === params.id ? { ...p, name, description } : p
    )
    
    localStorage.setItem('projects', JSON.stringify(updated))
    router.push('/projects')
  }

  return (
    <div key={params.id} className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">Edit: {project?.name}</h1>
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        className="border-white border-2 rounded-md block mb-4 h-10 bg-transparent pl-2 w-full max-w-md"/>
      <input 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        className="border-white border-2 rounded-md block mb-4 h-24 bg-transparent pl-2 w-full max-w-md"/>
      <button 
        onClick={handleEdit} 
        className="rounded-full px-8 h-10 bg-white text-black hover:bg-gray-200 transition-colors cursor-pointer">Save</button>
    </div>
  )
}