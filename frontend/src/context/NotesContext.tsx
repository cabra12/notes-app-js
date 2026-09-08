import { createContext } from 'react'

export const categories = ['Personal', 'Work', 'Idea', 'Journal'] as const
export type Category = (typeof categories)[number]

//an object whose keys are exactly the Category values, and whose values are strings
export const categoryColors: Record<Category, string> = {
    Personal: '#c2e5df',
    Work: '#f3d4f3',
    Idea: '#ffe9ae',
    Journal: '#ffcaa4',
}

export type FilterOption = 'All' | Category

export function getFilterColor(option: FilterOption): string {
    if (option === 'All') return '#ffd1d3'
    return categoryColors[option]
}

export interface NoteType {
    id: string
    title: string
    text: string
    category: Category
    timestamp: number
    editmode: boolean
}

export interface NotesContextType {
    notes: NoteType[]
    addNote: (title: string, text: string, category: Category) => void
    deleteNote: (noteId: string) => void
    saveNote: (noteId: string, text: string) => void
    activeFilter: FilterOption
    setActiveFilter: (filter: FilterOption) => void
}

export const NotesContext = createContext<NotesContextType | null>(null)
