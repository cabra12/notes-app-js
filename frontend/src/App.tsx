import Sidebar from './components/sidebar'
import NotesContainer from './components/notes-container'
import { NotesContext } from './context/NotesContext'
import type { NoteType } from './context/NotesContext'
import { useEffect, useState } from 'react'
import './index.css'

function App() {
    const [notes, setNotes] = useState<NoteType[]>(() => {
        const notes = localStorage.getItem('notes-data')

        if (notes) {
            return JSON.parse(notes)
        }

        return []
    })

    const addNote = (theme: string) => {
        setNotes([
            {
                id: Math.random().toString(36),
                text: '',
                theme,
                timestamp: +new Date(),
                editmode: true,
            },
            ...notes,
        ])
    }

    const deleteNote = (noteId: string) => {
        setNotes(notes.filter((note) => note.id !== noteId))
    }

    const saveNote = (noteId: string, text: string) => {
        setNotes(notes.map((singleNote) => (singleNote.id === noteId ? { ...singleNote, text, editmode: false } : singleNote)))
    }

    useEffect(() => {
        //add DB/backend?
        localStorage.setItem('notes-data', JSON.stringify(notes))
    }, [notes])

    const value = {
        notes,
        addNote,
        deleteNote,
        saveNote,
    }

    return (
        <NotesContext.Provider value={value}>
            <div className="notes-app">
                <Sidebar />
                <NotesContainer />
            </div>
        </NotesContext.Provider>
    )
}

export default App
