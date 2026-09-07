import Sidebar from './components/sidebar'
import NotesContainer from './components/notes-container'
import { NotesContext } from './context/NotesContext'
import type { Note } from './context/NotesContext'
import { useState } from 'react'

function App() {
    const [notes, setNotes] = useState<Note[]>([])
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
