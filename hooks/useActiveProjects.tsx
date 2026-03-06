"use client"

import { useState, useEffect } from "react"

export function useActiveProject() {
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null)


    useEffect(() => {
        const saved = localStorage.getItem("activeProject")
        if (saved) setActiveProjectId(saved)
        }, [])

    const setActiveProject = (id: string) => {
        localStorage.setItem("activeProject", id)
        setActiveProjectId(id)
    }

    return {
        setActiveProject,
        setActiveProjectId,
    
    }
}