import NotesContainer from './components/notes-container'
import { NotesContext } from './context/NotesContext'
import type { NoteType, FilterOption, Category } from './context/NotesContext'
import { useEffect, useState } from 'react'
import './index.css'
import Header from './components/header'
import FilterBar from './components/filter-bar'

function App() {
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All')

    const [notes, setNotes] = useState<NoteType[]>(() => {
        const notes = localStorage.getItem('notes-data')

        if (notes) {
            return JSON.parse(notes)
        }

        return []
    })

    const addNote = (title: string, text: string, category: Category) => {
        setNotes([
            {
                id: Math.random().toString(36),
                title,
                text,
                category,
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
        activeFilter,
        setActiveFilter,
    }

    return (
        <NotesContext.Provider value={value}>
            <div className="notes-app">
                <Header />
                <FilterBar />
                <NotesContainer />
            </div>
        </NotesContext.Provider>
    )
}

export default App
