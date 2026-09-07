import { createContext } from 'react'

export type Note = {
    id: string
    text: string
    theme: string
    timestamp: number
    editmode: boolean
}

export interface NotesContextType {
    notes: Note[]
    addNote: (theme: string) => void
    deleteNote: (noteId: string) => void
    saveNote: (noteId: string, text: string) => void
}

export const NotesContext = createContext<NotesContextType | null>(null)
